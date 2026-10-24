import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CAMPAIGN } from '../data/campaign';
import { CARDS } from '../data/cards';
import { HEROES } from '../data/heroes';
import { RELICS } from '../data/relics';
import { CampaignChoice, CampaignNode } from '../models/campaign.model';
import { CardDefinition, CardEffect, CardInstance } from '../models/card.model';
import { BattleState, EnemyDefinition, EnemyState, StatusEffect, StatusId } from '../models/combat.model';
import { GameState, PendingReward } from '../models/game-state.model';
import { HeroDefinition, HeroId } from '../models/hero.model';
import { RelicDefinition, RelicEffect } from '../models/relic.model';

const STORAGE_KEY = 'eclipse-of-aeloria-card-rpg-v1';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly stateSubject = new BehaviorSubject<GameState>(this.load() ?? this.createEmptyState());
  readonly state$ = this.stateSubject.asObservable();

  get snapshot(): GameState {
    return this.stateSubject.value;
  }

  get hasSave(): boolean {
    return !!this.readStorage();
  }

  get campaign(): CampaignNode[] {
    return CAMPAIGN;
  }

  get currentNode(): CampaignNode | null {
    return CAMPAIGN[this.snapshot.currentNodeIndex] ?? null;
  }

  get hero(): HeroDefinition | null {
    return this.snapshot.heroId ? this.getHero(this.snapshot.heroId) : null;
  }

  newGame(): void {
    this.commit(this.createEmptyState());
  }

  clearSave(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    this.stateSubject.next(this.createEmptyState());
  }

  getHero(id: HeroId): HeroDefinition {
    const hero = HEROES.find((item) => item.id === id);
    if (!hero) throw new Error(`Hero not found: ${id}`);
    return hero;
  }

  getCardDefinition(id: string): CardDefinition {
    const card = CARDS.find((item) => item.id === id);
    if (!card) throw new Error(`Card not found: ${id}`);
    return card;
  }

  getCardInstance(uid: string, state = this.snapshot): CardInstance | undefined {
    return state.deck.find((item) => item.uid === uid);
  }

  getRelic(id: string): RelicDefinition | undefined {
    return RELICS.find((item) => item.id === id);
  }

  selectHero(heroId: HeroId): void {
    const hero = this.getHero(heroId);
    const deck = hero.starterDeck.map((cardId, index) => this.makeCardInstance(cardId, index));
    const state: GameState = {
      heroId: hero.id,
      heroName: hero.name,
      hp: hero.maxHp,
      maxHp: hero.maxHp,
      gold: 0,
      deck,
      relicIds: [],
      currentNodeIndex: 0,
      completedNodeIds: [],
      battle: null,
      pendingReward: null,
      runWon: false,
    };
    this.commit(state);
  }

  startBattle(nodeId: string): void {
    const node = CAMPAIGN.find((item) => item.id === nodeId);
    if (!node || !node.enemies || !['battle', 'elite', 'boss'].includes(node.type)) {
      throw new Error('Invalid combat node');
    }
    if (node.index !== this.snapshot.currentNodeIndex) {
      throw new Error('Node is not currently available');
    }

    const state = this.clone(this.snapshot);
    const hero = this.hero;
    if (!hero) throw new Error('Choose a hero before battle');

    const maxEnergy = hero.baseEnergy + this.getRelicBonus(state, 'energy');
    const handSize = hero.handSize + this.getRelicBonus(state, 'draw');
    const drawPile = this.shuffle(state.deck.map((card) => card.uid));

    state.battle = {
      encounterId: node.id,
      phase: 'intro',
      turn: 0,
      energy: maxEnergy,
      maxEnergy,
      handSize,
      block: 0,
      playerStatuses: [],
      drawPile,
      discardPile: [],
      exhaustPile: [],
      hand: [],
      enemies: node.enemies.map((enemy, index) => this.createEnemy(enemy, index)),
      selectedCardUid: null,
      logs: [`${node.act} • ${node.title}`, node.story],
      cardsPlayedThisTurn: 0,
      blockCardsPlayedThisTurn: 0,
      enemyActionIndex: 0,
    };

    state.hp = Math.max(1, state.hp);
    this.commit(state);
  }

  beginCombat(): void {
    const state = this.clone(this.snapshot);
    if (!state.battle || state.battle.phase !== 'intro') return;

    state.battle.block = this.getRelicBonus(state, 'openingBlock');
    state.battle.logs.push('O combate começou. Compre sua mão e combine cartas enquanto tiver Energia.');
    this.startPlayerTurn(state);
    this.commit(state);
  }

  selectCard(uid: string | null): void {
    const state = this.clone(this.snapshot);
    const battle = state.battle;
    if (!battle || battle.phase !== 'player') return;

    if (!uid) {
      battle.selectedCardUid = null;
      this.commit(state);
      return;
    }

    const instance = this.getCardInstance(uid, state);
    if (!instance || !battle.hand.includes(uid)) return;
    const card = this.getCardDefinition(instance.cardId);
    if (card.cost > battle.energy) return;

    battle.selectedCardUid = battle.selectedCardUid === uid ? null : uid;
    this.commit(state);
  }

  playSelectedCard(targetInstanceId?: string): boolean {
    const state = this.clone(this.snapshot);
    const battle = state.battle;
    if (!battle || battle.phase !== 'player' || !battle.selectedCardUid) return false;

    const uid = battle.selectedCardUid;
    const instance = this.getCardInstance(uid, state);
    if (!instance || !battle.hand.includes(uid)) return false;
    const card = this.getCardDefinition(instance.cardId);
    if (card.cost > battle.energy) return false;

    if (card.target === 'enemy') {
      const enemy = battle.enemies.find((item) => item.instanceId === targetInstanceId && item.hp > 0);
      if (!enemy) return false;
    }

    battle.energy -= card.cost;
    battle.selectedCardUid = null;
    battle.cardsPlayedThisTurn += 1;

    const targets = this.resolveTargets(battle, card, targetInstanceId);
    for (const effect of card.effects) {
      this.applyCardEffect(state, instance, card, effect, targets);
      if (battle.phase !== 'player') break;
    }

    this.removeFromArray(battle.hand, uid);
    if (card.exhaust) battle.exhaustPile.push(uid);
    else battle.discardPile.push(uid);

    if (this.allEnemiesDefeated(battle)) {
      this.handleVictory(state);
      this.commit(state);
      return true;
    }

    battle.logs.push(`${card.name} foi jogada. Energia: ${battle.energy}/${battle.maxEnergy}.`);
    this.commit(state);
    return true;
  }

  playCardImmediately(uid: string): boolean {
    const state = this.snapshot;
    const instance = this.getCardInstance(uid, state);
    if (!state.battle || !instance || !state.battle.hand.includes(uid)) return false;
    const card = this.getCardDefinition(instance.cardId);
    if (card.target === 'enemy') {
      this.selectCard(uid);
      return false;
    }
    this.selectCard(uid);
    return this.playSelectedCard();
  }

  /**
   * Encerra somente a fase do jogador. A fase inimiga é resolvida em passos
   * por resolveNextEnemyAction(), permitindo que a UI mostre claramente cada ação.
   */
  endPlayerTurn(): boolean {
    const state = this.clone(this.snapshot);
    const battle = state.battle;
    if (!battle || battle.phase !== 'player') return false;

    battle.phase = 'enemy';
    battle.selectedCardUid = null;
    battle.enemyActionIndex = 0;

    while (battle.hand.length) {
      const uid = battle.hand.shift();
      if (uid) battle.discardPile.push(uid);
    }

    this.decrementEnemyStatusAfterPlayerTurn(battle, 'vulnerable');
    battle.logs.push('Fim do seu turno. Os inimigos executam as intenções anunciadas.');
    this.commit(state);
    return true;
  }

  /**
   * Resolve exatamente um inimigo. Retorna true enquanto ainda houver uma
   * próxima ação inimiga; false quando o jogo mudou para jogador/vitória/derrota.
   */
  resolveNextEnemyAction(): boolean {
    const state = this.clone(this.snapshot);
    const battle = state.battle;
    if (!battle || battle.phase !== 'enemy') return false;

    let enemy: EnemyState | undefined;
    while (battle.enemyActionIndex < battle.enemies.length) {
      const candidate = battle.enemies[battle.enemyActionIndex];
      battle.enemyActionIndex += 1;
      if (candidate.hp > 0) {
        enemy = candidate;
        break;
      }
    }

    if (enemy) {
      enemy.block = 0;
      this.tickEnemyDamageStatuses(battle, enemy);

      if (enemy.hp > 0) {
        this.resolveSingleEnemyAction(state, enemy);
      }
    }

    if (state.hp <= 0) {
      battle.phase = 'defeat';
      battle.logs.push('A jornada termina aqui... por enquanto.');
      this.commit(state);
      return false;
    }

    if (this.allEnemiesDefeated(battle)) {
      this.handleVictory(state);
      this.commit(state);
      return false;
    }

    const hasMoreLivingEnemies = battle.enemies
      .slice(battle.enemyActionIndex)
      .some((item) => item.hp > 0);

    if (hasMoreLivingEnemies) {
      this.commit(state);
      return true;
    }

    this.decrementPlayerStatusesAfterEnemyPhase(battle);
    this.startPlayerTurn(state);
    this.commit(state);
    return false;
  }

  retryBattle(): void {
    const battle = this.snapshot.battle;
    if (!battle) return;
    const node = CAMPAIGN.find((item) => item.id === battle.encounterId);
    if (!node) return;

    const state = this.clone(this.snapshot);
    state.hp = state.maxHp;
    state.battle = null;
    this.commit(state);
    this.startBattle(node.id);
  }

  claimCard(cardId: string | null): void {
    const state = this.clone(this.snapshot);
    const reward = state.pendingReward;
    if (!reward || reward.cardResolved) return;

    if (cardId && reward.cardChoices.includes(cardId)) {
      state.deck.push(this.makeCardInstance(cardId, state.deck.length + Date.now()));
    }
    reward.cardResolved = true;
    this.commit(state);
  }

  claimRelic(relicId: string | null): void {
    const state = this.clone(this.snapshot);
    const reward = state.pendingReward;
    if (!reward || reward.relicResolved) return;

    if (relicId && reward.relicChoices.includes(relicId) && !state.relicIds.includes(relicId)) {
      state.relicIds.push(relicId);
      this.applyRelicImmediate(state, relicId);
    }
    reward.relicResolved = true;
    this.commit(state);
  }

  finishReward(): void {
    const state = this.clone(this.snapshot);
    const reward = state.pendingReward;
    if (!reward || !reward.cardResolved || !reward.relicResolved) return;

    state.pendingReward = null;
    state.battle = null;
    state.currentNodeIndex += 1;
    this.commit(state);
  }

  resolveEvent(choiceId: string): boolean {
    const state = this.clone(this.snapshot);
    const node = CAMPAIGN[state.currentNodeIndex];
    if (!node || node.type !== 'event') return false;
    const choice = node.choices?.find((item) => item.id === choiceId);
    if (!choice) return false;
    if ((choice.cost ?? 0) > state.gold) return false;

    state.gold -= choice.cost ?? 0;
    this.applyCampaignChoice(state, choice);
    this.completeNonCombatNode(state, node.id);
    this.commit(state);
    return true;
  }

  restHeal(): void {
    const state = this.clone(this.snapshot);
    const node = CAMPAIGN[state.currentNodeIndex];
    if (!node || node.type !== 'rest') return;

    const amount = Math.max(1, Math.round(state.maxHp * 0.35));
    state.hp = Math.min(state.maxHp, state.hp + amount);
    this.completeNonCombatNode(state, node.id);
    this.commit(state);
  }

  restUpgradeCard(uid: string): boolean {
    const state = this.clone(this.snapshot);
    const node = CAMPAIGN[state.currentNodeIndex];
    if (!node || node.type !== 'rest') return false;
    const card = state.deck.find((item) => item.uid === uid);
    if (!card || card.upgraded) return false;

    card.upgraded = true;
    this.completeNonCombatNode(state, node.id);
    this.commit(state);
    return true;
  }

  getResolvedCardText(instance: CardInstance): string {
    const def = this.getCardDefinition(instance.cardId);
    return instance.upgraded ? def.upgradedDescription : def.description;
  }

  canAffordCard(instance: CardInstance): boolean {
    const battle = this.snapshot.battle;
    if (!battle) return false;
    return this.getCardDefinition(instance.cardId).cost <= battle.energy;
  }

  private createEmptyState(): GameState {
    return {
      heroId: null,
      heroName: '',
      hp: 0,
      maxHp: 0,
      gold: 0,
      deck: [],
      relicIds: [],
      currentNodeIndex: 0,
      completedNodeIds: [],
      battle: null,
      pendingReward: null,
      runWon: false,
    };
  }

  private createEnemy(def: EnemyDefinition, index: number): EnemyState {
    return {
      instanceId: `${def.id}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      definitionId: def.id,
      name: def.name,
      race: def.race,
      title: def.title,
      sigil: def.sigil,
      hp: def.maxHp,
      maxHp: def.maxHp,
      block: 0,
      statuses: [],
      intentIndex: 0,
      intent: this.clone(def.pattern[0]),
    };
  }

  private startPlayerTurn(state: GameState): void {
    const battle = state.battle;
    if (!battle) return;

    battle.phase = 'player';
    battle.turn += 1;
    battle.energy = battle.maxEnergy;
    battle.cardsPlayedThisTurn = 0;
    battle.blockCardsPlayedThisTurn = 0;
    battle.enemyActionIndex = 0;
    battle.selectedCardUid = null;
    battle.block = 0;

    this.tickPlayerDamageStatuses(state);
    if (state.hp <= 0) {
      battle.phase = 'defeat';
      return;
    }

    this.drawCards(battle, battle.handSize);
    battle.logs.push(`Turno ${battle.turn}: ${battle.hand.length} cartas na mão e ${battle.energy} de Energia.`);
  }

  private resolveSingleEnemyAction(state: GameState, enemy: EnemyState): void {
    const battle = state.battle;
    if (!battle || enemy.hp <= 0 || state.hp <= 0) return;

    const intent = enemy.intent;
    const weak = this.getStatusValue(enemy.statuses, 'weak') > 0 ? 0.75 : 1;

    if (intent.type === 'defend') {
      enemy.block += intent.block ?? 0;
      battle.logs.push(`${enemy.name} usa ${intent.name} e ganha ${intent.block ?? 0} de Bloqueio.`);
    } else if (intent.type === 'weak') {
      this.addStatus(battle.playerStatuses, 'weak', intent.statusValue ?? 1, intent.statusTurns ?? 1);
      battle.logs.push(`${enemy.name} usa ${intent.name}: você fica Fraco.`);
    } else {
      const baseDamage = Math.max(0, Math.round((intent.damage ?? 0) * weak));
      const damage = this.applyDamageToPlayer(state, baseDamage);
      battle.logs.push(`${enemy.name} usa ${intent.name} e causa ${damage} de dano.`);

      if (intent.type === 'poison') {
        this.addStatus(battle.playerStatuses, 'poison', intent.statusValue ?? 2, intent.statusTurns ?? 2);
        battle.logs.push(`Veneno: ${intent.statusValue ?? 2} por turno.`);
      }

      if (intent.type === 'drain' && damage > 0) {
        const healed = Math.min(enemy.maxHp - enemy.hp, Math.max(1, Math.round(damage * 0.5)));
        enemy.hp += healed;
        battle.logs.push(`${enemy.name} drena ${healed} de Vida.`);
      }

      const thorns = this.getStatusValue(battle.playerStatuses, 'thorns');
      if (thorns > 0 && enemy.hp > 0) {
        const reflected = this.applyDamageToEnemy(enemy, thorns);
        battle.logs.push(`Espinhos devolvem ${reflected} de dano a ${enemy.name}.`);
      }
    }

    const def = this.getEnemyDefinition(battle.encounterId, enemy.definitionId);
    enemy.intentIndex = (enemy.intentIndex + 1) % def.pattern.length;
    enemy.intent = this.clone(def.pattern[enemy.intentIndex]);
    this.decrementStatus(enemy.statuses, 'weak');
  }

  private applyCardEffect(
    state: GameState,
    instance: CardInstance,
    card: CardDefinition,
    effect: CardEffect,
    targets: EnemyState[],
  ): void {
    const battle = state.battle;
    if (!battle) return;

    const value = instance.upgraded && effect.upgradedValue !== undefined ? effect.upgradedValue : effect.value;
    const hits = instance.upgraded && effect.upgradedHits !== undefined ? effect.upgradedHits : effect.hits ?? 1;
    const duration = instance.upgraded && effect.upgradedDuration !== undefined ? effect.upgradedDuration : effect.duration ?? value;

    switch (effect.kind) {
      case 'damage': {
        const weakMultiplier = this.getStatusValue(battle.playerStatuses, 'weak') > 0 ? 0.75 : 1;
        let passiveBonus = 0;
        if (state.heroId === 'moon-ranger' && battle.cardsPlayedThisTurn === 1 && card.type === 'attack') passiveBonus = 2;
        for (const target of targets) {
          for (let hit = 0; hit < hits; hit += 1) {
            if (target.hp <= 0) break;
            const raw = Math.max(0, Math.round((value + (hit === 0 ? passiveBonus : 0)) * weakMultiplier));
            const dealt = this.applyDamageToEnemy(target, raw);
            battle.logs.push(`${card.name} causa ${dealt} de dano a ${target.name}.`);
          }
        }
        break;
      }
      case 'block': {
        let bonus = this.getRelicBonus(state, 'blockBonus');
        if (state.heroId === 'warden' && battle.blockCardsPlayedThisTurn === 0) bonus += 3;
        battle.block += value + bonus;
        battle.blockCardsPlayedThisTurn += 1;
        battle.logs.push(`${card.name}: +${value + bonus} de Bloqueio.`);
        break;
      }
      case 'draw':
        if (value > 0) this.drawCards(battle, value);
        break;
      case 'energy':
        battle.energy += value;
        break;
      case 'heal': {
        const before = state.hp;
        state.hp = Math.min(state.maxHp, state.hp + value);
        battle.logs.push(`${card.name} recupera ${state.hp - before} de Vida.`);
        break;
      }
      case 'poison': {
        const poisonBonus = (state.heroId === 'duskblade' ? 1 : 0) + this.getRelicBonus(state, 'poisonBonus');
        for (const target of targets) this.addStatus(target.statuses, 'poison', value + poisonBonus, duration);
        break;
      }
      case 'bleed':
      case 'weak':
      case 'vulnerable':
        for (const target of targets) this.addStatus(target.statuses, effect.kind, value, duration);
        break;
      case 'thorns':
        this.addStatus(battle.playerStatuses, 'thorns', value, duration);
        break;
    }
  }

  private resolveTargets(battle: BattleState, card: CardDefinition, targetInstanceId?: string): EnemyState[] {
    if (card.target === 'all-enemies') return battle.enemies.filter((enemy) => enemy.hp > 0);
    if (card.target === 'enemy') {
      const enemy = battle.enemies.find((item) => item.instanceId === targetInstanceId && item.hp > 0);
      return enemy ? [enemy] : [];
    }
    return [];
  }

  private handleVictory(state: GameState): void {
    const battle = state.battle;
    if (!battle) return;
    const node = CAMPAIGN.find((item) => item.id === battle.encounterId);
    if (!node) return;

    battle.phase = 'victory';
    battle.selectedCardUid = null;
    if (!state.completedNodeIds.includes(node.id)) state.completedNodeIds.push(node.id);
    state.gold += node.goldReward ?? 0;
    battle.logs.push(node.afterVictory ?? 'Vitória.');

    if (node.index === CAMPAIGN.length - 1) {
      state.runWon = true;
      state.currentNodeIndex = CAMPAIGN.length;
      state.pendingReward = null;
      return;
    }

    const reward: PendingReward = {
      encounterId: node.id,
      gold: node.goldReward ?? 0,
      cardChoices: node.cardReward ? this.pickCardRewards(state, node.index, 3) : [],
      relicChoices: node.relicReward ? this.pickRelicRewards(state, 3) : [],
      cardResolved: !node.cardReward,
      relicResolved: !node.relicReward,
      story: node.afterVictory ?? '',
    };
    state.pendingReward = reward;
  }

  private pickCardRewards(state: GameState, nodeIndex: number, count: number): string[] {
    const hero = this.hero;
    if (!hero) return [];

    const pool = CARDS.filter((card) => {
      if (card.rarity === 'starter') return false;
      if ((card.unlockAfterNode ?? 0) > nodeIndex) return false;
      if (card.faction === 'neutral' || card.faction === hero.faction) return true;
      if (card.faction === 'orc' && nodeIndex >= 3) return true;
      if ((card.faction === 'high-elf' || card.faction === 'dark-elf') && nodeIndex >= 6) return true;
      return false;
    });

    return this.shuffle(pool.map((card) => card.id)).slice(0, count);
  }

  private pickRelicRewards(state: GameState, count: number): string[] {
    const available = RELICS.filter((relic) => !state.relicIds.includes(relic.id));
    return this.shuffle(available.map((relic) => relic.id)).slice(0, count);
  }

  private applyRelicImmediate(state: GameState, relicId: string): void {
    const relic = this.getRelic(relicId);
    if (!relic) return;
    if (relic.effect === 'maxHp') {
      state.maxHp += relic.value;
      state.hp = Math.min(state.maxHp, state.hp + relic.value);
    }
  }

  private applyCampaignChoice(state: GameState, choice: CampaignChoice): void {
    switch (choice.effect) {
      case 'heal': {
        const amount = Math.round(state.maxHp * ((choice.value ?? 0) / 100));
        state.hp = Math.min(state.maxHp, state.hp + amount);
        break;
      }
      case 'gold':
        state.gold += choice.value ?? 0;
        break;
      case 'card':
        if (choice.cardId) state.deck.push(this.makeCardInstance(choice.cardId, Date.now()));
        break;
      case 'maxHp':
        state.maxHp += choice.value ?? 0;
        state.hp = Math.min(state.maxHp, state.hp + (choice.value ?? 0));
        break;
    }
  }

  private completeNonCombatNode(state: GameState, nodeId: string): void {
    if (!state.completedNodeIds.includes(nodeId)) state.completedNodeIds.push(nodeId);
    state.currentNodeIndex += 1;
    state.battle = null;
  }

  private drawCards(battle: BattleState, count: number): void {
    for (let i = 0; i < count; i += 1) {
      if (battle.drawPile.length === 0 && battle.discardPile.length > 0) {
        battle.drawPile = this.shuffle([...battle.discardPile]);
        battle.discardPile = [];
        battle.logs.push('O descarte foi embaralhado e voltou ao deck.');
      }
      const uid = battle.drawPile.shift();
      if (!uid) break;
      battle.hand.push(uid);
    }
  }

  private tickPlayerDamageStatuses(state: GameState): void {
    const battle = state.battle;
    if (!battle) return;
    for (const id of ['poison', 'bleed'] as StatusId[]) {
      const status = battle.playerStatuses.find((item) => item.id === id);
      if (!status) continue;
      const damage = id === 'poison' ? status.value : Math.max(1, Math.ceil(status.value / 2));
      state.hp = Math.max(0, state.hp - damage);
      battle.logs.push(`${id === 'poison' ? 'Veneno' : 'Sangramento'} causa ${damage} de dano.`);
      status.turns -= 1;
    }
    battle.playerStatuses = battle.playerStatuses.filter((item) => item.turns > 0);
  }

  private tickEnemyDamageStatuses(battle: BattleState, enemy: EnemyState): void {
    for (const id of ['poison', 'bleed'] as StatusId[]) {
      const status = enemy.statuses.find((item) => item.id === id);
      if (!status) continue;
      const damage = id === 'poison' ? status.value : Math.max(1, Math.ceil(status.value / 2));
      const dealt = this.applyDamageToEnemy(enemy, damage, true);
      battle.logs.push(`${enemy.name} sofre ${dealt} de ${id === 'poison' ? 'Veneno' : 'Sangramento'}.`);
      status.turns -= 1;
    }
    enemy.statuses = enemy.statuses.filter((item) => item.turns > 0);
  }

  private decrementEnemyStatusAfterPlayerTurn(battle: BattleState, id: StatusId): void {
    for (const enemy of battle.enemies) this.decrementStatus(enemy.statuses, id);
  }

  private decrementPlayerStatusesAfterEnemyPhase(battle: BattleState): void {
    for (const id of ['weak', 'vulnerable', 'thorns'] as StatusId[]) this.decrementStatus(battle.playerStatuses, id);
  }

  private decrementStatus(statuses: StatusEffect[], id: StatusId): void {
    const status = statuses.find((item) => item.id === id);
    if (!status) return;
    status.turns -= 1;
    const index = statuses.findIndex((item) => item.id === id && item.turns <= 0);
    if (index >= 0) statuses.splice(index, 1);
  }

  private addStatus(statuses: StatusEffect[], id: StatusId, value: number, turns: number): void {
    const existing = statuses.find((item) => item.id === id);
    if (existing) {
      existing.value = Math.max(existing.value, value);
      existing.turns = Math.max(existing.turns, turns);
    } else {
      statuses.push({ id, value, turns });
    }
  }

  private getStatusValue(statuses: StatusEffect[], id: StatusId): number {
    return statuses.find((item) => item.id === id)?.value ?? 0;
  }

  private applyDamageToEnemy(enemy: EnemyState, rawDamage: number, ignoreVulnerable = false): number {
    const vulnerable = !ignoreVulnerable && this.getStatusValue(enemy.statuses, 'vulnerable') > 0 ? 1.5 : 1;
    let damage = Math.max(0, Math.round(rawDamage * vulnerable));
    const absorbed = Math.min(enemy.block, damage);
    enemy.block -= absorbed;
    damage -= absorbed;
    enemy.hp = Math.max(0, enemy.hp - damage);
    return damage;
  }

  private applyDamageToPlayer(state: GameState, rawDamage: number): number {
    const battle = state.battle;
    if (!battle) return 0;
    const vulnerable = this.getStatusValue(battle.playerStatuses, 'vulnerable') > 0 ? 1.5 : 1;
    let damage = Math.max(0, Math.round(rawDamage * vulnerable));
    const absorbed = Math.min(battle.block, damage);
    battle.block -= absorbed;
    damage -= absorbed;
    state.hp = Math.max(0, state.hp - damage);
    return damage;
  }

  private getRelicBonus(state: GameState, effect: RelicEffect): number {
    return state.relicIds.reduce((total, id) => {
      const relic = this.getRelic(id);
      return total + (relic?.effect === effect ? relic.value : 0);
    }, 0);
  }

  private getEnemyDefinition(encounterId: string, definitionId: string): EnemyDefinition {
    const node = CAMPAIGN.find((item) => item.id === encounterId);
    const enemy = node?.enemies?.find((item) => item.id === definitionId);
    if (!enemy) throw new Error(`Enemy definition not found: ${definitionId}`);
    return enemy;
  }

  private allEnemiesDefeated(battle: BattleState): boolean {
    return battle.enemies.every((enemy) => enemy.hp <= 0);
  }

  private removeFromArray(items: string[], value: string): void {
    const index = items.indexOf(value);
    if (index >= 0) items.splice(index, 1);
  }

  private makeCardInstance(cardId: string, seed: number): CardInstance {
    return {
      uid: `${cardId}-${seed}-${Math.random().toString(36).slice(2, 8)}`,
      cardId,
      upgraded: false,
    };
  }

  private shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }

  private commit(state: GameState): void {
    this.stateSubject.next(state);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  private readStorage(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private load(): GameState | null {
    const raw = this.readStorage();
    if (!raw) return null;
    try {
      const state = JSON.parse(raw) as GameState;
      if (state.battle) state.battle.enemyActionIndex ??= 0;
      return state;
    } catch {
      return null;
    }
  }
}

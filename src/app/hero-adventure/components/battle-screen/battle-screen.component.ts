import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignNode } from '../../models/campaign.model';
import { CardDefinition, CardInstance } from '../../models/card.model';
import { EnemyIntentDefinition, EnemyState, StatusEffect } from '../../models/combat.model';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-battle-screen',
  templateUrl: './battle-screen.component.html',
  styleUrls: ['./battle-screen.component.scss'],
})
export class BattleScreenComponent implements OnInit, OnDestroy {
  node: CampaignNode | null = null;
  showDeck = false;
  resolvingEnemyTurn = false;
  activeEnemyId: string | null = null;
  feedback = '';

  private enemyTimer: ReturnType<typeof setTimeout> | null = null;
  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    public game: GameService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const nodeId = this.route.snapshot.paramMap.get('nodeId');
    if (!nodeId) {
      this.router.navigate(['/campaign']);
      return;
    }

    this.node = this.game.campaign.find((item) => item.id === nodeId) ?? null;
    if (!this.node) {
      this.router.navigate(['/campaign']);
      return;
    }

    const battle = this.game.snapshot.battle;
    const shouldStart = !battle
      || battle.encounterId !== nodeId
      || (battle.phase === 'victory' && !this.game.snapshot.pendingReward && !this.game.snapshot.runWon);

    if (shouldStart) {
      try {
        this.game.startBattle(nodeId);
      } catch {
        this.router.navigate(['/campaign']);
        return;
      }
    }

    // Se a página foi recarregada durante a fase inimiga, a batalha continua
    // automaticamente em vez de ficar parada sem controles.
    if (this.battle?.phase === 'enemy') {
      this.resumeEnemyTurn(250);
    }
  }

  ngOnDestroy(): void {
    if (this.enemyTimer) clearTimeout(this.enemyTimer);
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
  }

  @HostListener('document:keydown.escape')
  cancelWithEscape(): void {
    if (this.selectedCard) this.cancelTarget();
    else if (this.showDeck) this.showDeck = false;
  }

  get battle() {
    return this.game.snapshot.battle;
  }

  get hand(): CardInstance[] {
    const battle = this.battle;
    if (!battle) return [];
    return battle.hand
      .map((uid) => this.game.getCardInstance(uid))
      .filter(Boolean) as CardInstance[];
  }

  get selectedCard(): CardInstance | null {
    const uid = this.battle?.selectedCardUid;
    return uid ? this.game.getCardInstance(uid) ?? null : null;
  }

  get selectedDefinition(): CardDefinition | null {
    return this.selectedCard ? this.game.getCardDefinition(this.selectedCard.cardId) : null;
  }

  get livingEnemies(): EnemyState[] {
    return this.battle?.enemies.filter((enemy) => enemy.hp > 0) ?? [];
  }

  get playableCardsCount(): number {
    const energy = this.battle?.energy ?? 0;
    return this.hand.filter((instance) => this.cardDef(instance).cost <= energy).length;
  }

  get actionGuide(): string {
    const battle = this.battle;
    if (!battle) return '';

    if (battle.phase === 'enemy') {
      const enemy = this.currentEnemyToAct();
      return enemy ? `${enemy.name} está preparando ${enemy.intent.name}.` : 'Resolvendo o turno dos inimigos…';
    }

    if (battle.phase !== 'player') return '';

    if (this.selectedDefinition?.target === 'enemy') {
      return 'Carta selecionada. Clique em um inimigo destacado para usar a carta nele.';
    }

    if (battle.energy <= 0 || this.playableCardsCount === 0) {
      return 'Você não tem mais jogadas disponíveis. Clique em PASSAR A VEZ.';
    }

    return 'Sua vez: jogue cartas enquanto tiver Energia. Quando terminar, encerre o turno.';
  }

  get endTurnTitle(): string {
    return this.playableCardsCount === 0 ? 'PASSAR' : 'ENCERRAR';
  }

  cardDef(instance: CardInstance): CardDefinition {
    return this.game.getCardDefinition(instance.cardId);
  }

  cardDisabled(instance: CardInstance): boolean {
    return this.resolvingEnemyTurn || this.cardDef(instance).cost > (this.battle?.energy ?? 0);
  }

  selectOrPlay(instance: CardInstance): void {
    const battle = this.battle;
    if (!battle || battle.phase !== 'player' || this.resolvingEnemyTurn) return;

    const card = this.cardDef(instance);
    if (card.cost > battle.energy) {
      this.showFeedback(`Você precisa de ${card.cost} de Energia para jogar ${card.name}.`);
      return;
    }

    if (card.target === 'enemy') {
      // Com apenas um alvo vivo não existe decisão: joga direto e evita um clique confuso.
      if (this.livingEnemies.length === 1) {
        this.game.selectCard(instance.uid);
        this.game.playSelectedCard(this.livingEnemies[0].instanceId);
        this.showFeedback(`${card.name} usada em ${this.livingEnemies[0].name}.`);
        return;
      }

      this.game.selectCard(instance.uid);
      if (this.battle?.selectedCardUid === instance.uid) {
        this.showFeedback('Agora escolha um inimigo destacado. ESC cancela.');
      }
      return;
    }

    if (this.game.playCardImmediately(instance.uid)) {
      this.showFeedback(`${card.name} resolvida.`);
    }
  }

  targetEnemy(enemy: EnemyState): void {
    if (
      enemy.hp <= 0
      || this.resolvingEnemyTurn
      || !this.selectedCard
      || this.selectedDefinition?.target !== 'enemy'
    ) return;

    const cardName = this.selectedDefinition.name;
    if (this.game.playSelectedCard(enemy.instanceId)) {
      this.showFeedback(`${cardName} usada em ${enemy.name}.`);
    }
  }

  cancelTarget(): void {
    this.game.selectCard(null);
    this.showFeedback('Seleção de alvo cancelada.');
  }

  endTurn(): void {
    if (this.resolvingEnemyTurn || this.battle?.phase !== 'player') return;

    if (this.selectedCard) this.game.selectCard(null);

    if (!this.game.endPlayerTurn()) return;

    this.resolvingEnemyTurn = true;
    this.showFeedback('Turno encerrado. Agora os inimigos agem.');
    this.resumeEnemyTurn(550);
  }

  begin(): void {
    this.game.beginCombat();
    this.showFeedback('Sua primeira mão foi comprada. Use a Energia para jogar cartas.');
  }

  retry(): void {
    this.stopEnemyResolution();
    this.game.retryBattle();
  }

  continueAfterVictory(): void {
    if (this.game.snapshot.runWon) this.router.navigate(['/victory']);
    else this.router.navigate(['/reward']);
  }

  isEnemyActing(enemy: EnemyState): boolean {
    return this.battle?.phase === 'enemy' && this.activeEnemyId === enemy.instanceId;
  }

  intentIcon(intent: EnemyIntentDefinition): string {
    const icons: Record<EnemyIntentDefinition['type'], string> = {
      attack: '⚔', defend: '◆', poison: '☠', weak: '◌', drain: '◉',
    };
    return icons[intent.type];
  }

  intentText(intent: EnemyIntentDefinition): string {
    if (intent.type === 'defend') return `+${intent.block ?? 0} Bloqueio`;
    if (intent.type === 'weak') return 'Aplica Fraco';
    if (intent.type === 'poison') return `${intent.damage ?? 0} dano + Veneno`;
    if (intent.type === 'drain') return `${intent.damage ?? 0} dano + Dreno`;
    return `${intent.damage ?? 0} dano`;
  }

  statusLabel(status: StatusEffect): string {
    const names: Record<StatusEffect['id'], string> = {
      poison: 'Veneno', bleed: 'Sangra', weak: 'Fraco', vulnerable: 'Vulnerável', thorns: 'Espinhos',
    };
    return `${names[status.id]} ${status.value}${status.turns > 0 ? ` • ${status.turns}t` : ''}`;
  }

  hpPercent(enemy: EnemyState): number {
    return Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  }

  playerHpPercent(): number {
    return this.game.snapshot.maxHp ? (this.game.snapshot.hp / this.game.snapshot.maxHp) * 100 : 0;
  }

  visibleLogs(): string[] {
    return (this.battle?.logs ?? []).slice(-3);
  }

  deckInstances(): CardInstance[] {
    return this.game.snapshot.deck;
  }

  private resumeEnemyTurn(delay: number): void {
    this.resolvingEnemyTurn = true;
    this.queueNextEnemyAction(delay);
  }

  private queueNextEnemyAction(delay = 700): void {
    if (this.enemyTimer) clearTimeout(this.enemyTimer);

    const nextEnemy = this.currentEnemyToAct();
    this.activeEnemyId = nextEnemy?.instanceId ?? null;

    this.enemyTimer = setTimeout(() => {
      this.game.resolveNextEnemyAction();

      if (this.battle?.phase === 'enemy') {
        this.queueNextEnemyAction(700);
      } else {
        this.stopEnemyResolution();
        if (this.battle?.phase === 'player') {
          this.showFeedback(`Turno ${this.battle.turn}: sua nova mão foi comprada.`);
        }
      }
    }, delay);
  }

  private currentEnemyToAct(): EnemyState | null {
    const battle = this.battle;
    if (!battle || battle.phase !== 'enemy') return null;
    return battle.enemies.slice(battle.enemyActionIndex).find((enemy) => enemy.hp > 0) ?? null;
  }

  private stopEnemyResolution(): void {
    if (this.enemyTimer) clearTimeout(this.enemyTimer);
    this.enemyTimer = null;
    this.resolvingEnemyTurn = false;
    this.activeEnemyId = null;
  }

  private showFeedback(message: string): void {
    this.feedback = message;
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => {
      this.feedback = '';
    }, 2300);
  }
}

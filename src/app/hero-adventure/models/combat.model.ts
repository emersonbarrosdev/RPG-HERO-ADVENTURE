export type StatusId = 'poison' | 'bleed' | 'weak' | 'vulnerable' | 'thorns';
export type BattlePhase = 'intro' | 'player' | 'enemy' | 'victory' | 'defeat';

export interface StatusEffect {
  id: StatusId;
  value: number;
  turns: number;
}

export interface EnemyIntentDefinition {
  type: 'attack' | 'defend' | 'poison' | 'weak' | 'drain';
  name: string;
  damage?: number;
  block?: number;
  statusValue?: number;
  statusTurns?: number;
}

export interface EnemyDefinition {
  id: string;
  name: string;
  race: string;
  title: string;
  sigil: string;
  maxHp: number;
  pattern: EnemyIntentDefinition[];
}

export interface EnemyState {
  instanceId: string;
  definitionId: string;
  name: string;
  race: string;
  title: string;
  sigil: string;
  hp: number;
  maxHp: number;
  block: number;
  statuses: StatusEffect[];
  intentIndex: number;
  intent: EnemyIntentDefinition;
}

export interface BattleState {
  encounterId: string;
  phase: BattlePhase;
  turn: number;
  energy: number;
  maxEnergy: number;
  handSize: number;
  block: number;
  playerStatuses: StatusEffect[];
  drawPile: string[];
  discardPile: string[];
  exhaustPile: string[];
  hand: string[];
  enemies: EnemyState[];
  selectedCardUid: string | null;
  logs: string[];
  cardsPlayedThisTurn: number;
  blockCardsPlayedThisTurn: number;
  /** Índice do próximo inimigo que executará sua intenção durante a fase inimiga. */
  enemyActionIndex: number;
}

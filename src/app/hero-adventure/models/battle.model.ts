export type BattlePhase = 'intro' | 'player' | 'enemy' | 'reward' | 'defeat';
export type StatusId = 'bleed' | 'poison' | 'weaken';
export type EnemyMoveType = 'attack' | 'heavy' | 'guard' | 'poison' | 'drain';

export interface StatusEffect {
  id: StatusId;
  turns: number;
  potency: number;
}

export interface CombatantState {
  hp: number;
  maxHp: number;
  shield: number;
  attack: number;
  defense: number;
  statuses: StatusEffect[];
}

export interface HeroState extends CombatantState {
  name: string;
  title: string;
  race: string;
  level: number;
  xp: number;
  xpToNext: number;
  critChance: number;
  potionCharges: number;
  maxPotions: number;
  cooldowns: Record<string, number>;
}

export interface EnemyState extends CombatantState {
  stageId: string;
  name: string;
  title: string;
  faction: string;
  turnIndex: number;
  intent: EnemyIntent;
}

export interface EnemyIntent {
  type: EnemyMoveType;
  name: string;
  description: string;
  value: number;
  statusPotency?: number;
}

export interface BattleVisualEvent {
  actor: 'hero' | 'enemy' | 'system';
  type: 'attack' | 'heavy' | 'block' | 'heal' | 'poison' | 'bleed' | 'buff' | 'victory' | 'defeat';
  amount?: number;
  text: string;
}

export interface TurnResolution {
  events: BattleVisualEvent[];
  battleEnded: boolean;
}

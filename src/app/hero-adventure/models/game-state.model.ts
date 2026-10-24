import { BattleState } from './combat.model';
import { CardInstance } from './card.model';
import { HeroId } from './hero.model';

export interface PendingReward {
  encounterId: string;
  gold: number;
  cardChoices: string[];
  relicChoices: string[];
  cardResolved: boolean;
  relicResolved: boolean;
  story: string;
}

export interface GameState {
  heroId: HeroId | null;
  heroName: string;
  hp: number;
  maxHp: number;
  gold: number;
  deck: CardInstance[];
  relicIds: string[];
  currentNodeIndex: number;
  completedNodeIds: string[];
  battle: BattleState | null;
  pendingReward: PendingReward | null;
  runWon: boolean;
}

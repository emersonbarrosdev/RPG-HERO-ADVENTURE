import { EnemyDefinition } from './combat.model';

export type CampaignNodeType = 'battle' | 'elite' | 'boss' | 'event' | 'rest';

export interface CampaignChoice {
  id: string;
  label: string;
  description: string;
  effect: 'heal' | 'gold' | 'card' | 'maxHp';
  value?: number;
  cardId?: string;
  cost?: number;
}

export interface CampaignNode {
  id: string;
  index: number;
  act: string;
  title: string;
  region: string;
  type: CampaignNodeType;
  subtitle: string;
  story: string;
  background: string;
  enemies?: EnemyDefinition[];
  goldReward?: number;
  cardReward?: boolean;
  relicReward?: boolean;
  choices?: CampaignChoice[];
  afterVictory?: string;
}

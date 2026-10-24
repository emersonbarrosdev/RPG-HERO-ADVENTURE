import { FactionId, HeroId } from './hero.model';

export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'legendary';
export type CardTarget = 'enemy' | 'all-enemies' | 'self' | 'none';
export type CardEffectKind =
  | 'damage'
  | 'block'
  | 'draw'
  | 'energy'
  | 'heal'
  | 'poison'
  | 'bleed'
  | 'weak'
  | 'vulnerable'
  | 'thorns';

export interface CardEffect {
  kind: CardEffectKind;
  value: number;
  upgradedValue?: number;
  hits?: number;
  upgradedHits?: number;
  duration?: number;
  upgradedDuration?: number;
}

export interface CardDefinition {
  id: string;
  name: string;
  subtitle: string;
  type: CardType;
  rarity: CardRarity;
  faction: FactionId;
  cost: number;
  target: CardTarget;
  description: string;
  upgradedDescription: string;
  icon: string;
  effects: CardEffect[];
  exhaust?: boolean;
  rewardFor?: HeroId[];
  unlockAfterNode?: number;
}

export interface CardInstance {
  uid: string;
  cardId: string;
  upgraded: boolean;
}

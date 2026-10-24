export type RelicEffect = 'maxHp' | 'energy' | 'draw' | 'blockBonus' | 'poisonBonus' | 'openingBlock';

export interface RelicDefinition {
  id: string;
  name: string;
  origin: string;
  description: string;
  effect: RelicEffect;
  value: number;
  icon: string;
}

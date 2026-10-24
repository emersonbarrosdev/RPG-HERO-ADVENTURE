export type HeroId = 'warden' | 'moon-ranger' | 'duskblade';
export type FactionId = 'human' | 'high-elf' | 'dark-elf' | 'orc' | 'neutral';

export interface HeroDefinition {
  id: HeroId;
  name: string;
  race: string;
  title: string;
  faction: FactionId;
  crest: string;
  maxHp: number;
  baseEnergy: number;
  handSize: number;
  passiveName: string;
  passiveDescription: string;
  starterDeck: string[];
}

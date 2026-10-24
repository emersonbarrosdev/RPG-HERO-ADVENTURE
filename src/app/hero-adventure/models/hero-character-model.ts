export class HeroCharacterModel {
  constructor(
    public name: string,
    public HP: number,
    public ATK: number,
    public DEF: number,
    public maxHP: number,
    public level: number,
    public xp: number,
    public xpToNext: number,
    public potions: number,
    public maxPotions: number,
    public guard = false,
    public powerCooldown = 0,
  ) {}
}

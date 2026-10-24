export class EnemyCharacterModel {
  constructor(
    public id: string,
    public name: string,
    public title: string,
    public HP: number,
    public ATK: number,
    public DEF: number,
    public maxHP: number,
    public specialName: string,
    public specialMultiplier: number,
    public rewardXp: number,
    public turnCount = 0,
  ) {}
}

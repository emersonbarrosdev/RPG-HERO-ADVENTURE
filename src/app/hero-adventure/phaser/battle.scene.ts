import * as Phaser from 'phaser';
import { StageDefinition } from '../data/stages';
import { BattleVisualEvent } from '../models/battle.model';

export class BattleScene extends Phaser.Scene {
  private hero!: Phaser.GameObjects.Container;
  private enemy!: Phaser.GameObjects.Container;
  private heroAura!: Phaser.GameObjects.Arc;
  private enemyAura!: Phaser.GameObjects.Arc;
  private floatingLayer!: Phaser.GameObjects.Container;

  constructor(private readonly stage: StageDefinition) {
    super({ key: `battle-${stage.id}` });
  }

  preload(): void {
    this.load.image('stage-art', this.stage.background);
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    const bg = this.add.image(width / 2, height / 2, 'stage-art');
    const scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale);
    bg.setAlpha(0.78);

    this.add.rectangle(width / 2, height / 2, width, height, 0x06100e, 0.34);
    this.add.rectangle(width / 2, height - 74, width, 148, 0x020504, 0.44);

    this.createAtmosphere(width, height);
    this.createGround(width, height);

    this.hero = this.createFighter(252, height - 154, true);
    this.enemy = this.createFighter(width - 252, height - 154, false);
    this.floatingLayer = this.add.container(0, 0);

    this.tweens.add({
      targets: [this.hero, this.enemy],
      y: '-=5',
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  async play(events: BattleVisualEvent[]): Promise<void> {
    for (const event of events) {
      await this.playEvent(event);
    }
  }

  private createAtmosphere(width: number, height: number): void {
    const tint = this.themeTint();
    for (let i = 0; i < 26; i += 1) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = Phaser.Math.Between(30, height - 50);
      const radius = Phaser.Math.Between(1, 4);
      const mote = this.add.circle(x, y, radius, tint, Phaser.Math.FloatBetween(0.08, 0.35));
      this.tweens.add({
        targets: mote,
        y: y - Phaser.Math.Between(16, 58),
        x: x + Phaser.Math.Between(-18, 18),
        alpha: 0,
        duration: Phaser.Math.Between(2200, 5200),
        repeat: -1,
        delay: Phaser.Math.Between(0, 1200),
      });
    }
  }

  private createGround(width: number, height: number): void {
    const ground = this.add.ellipse(width / 2, height - 78, width * 0.72, 84, 0x020403, 0.72);
    ground.setStrokeStyle(2, this.themeTint(), 0.18);
    this.add.ellipse(252, height - 98, 230, 42, 0x000000, 0.38);
    this.add.ellipse(width - 252, height - 98, 230, 42, 0x000000, 0.38);
  }

  private createFighter(x: number, y: number, hero: boolean): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const primary = hero ? 0xd8c07b : this.enemyColor();
    const dark = hero ? 0x1f2d29 : 0x241818;

    const aura = this.add.circle(0, -76, 82, primary, 0.08);
    aura.setStrokeStyle(2, primary, 0.28);
    const body = this.add.rectangle(0, -46, 78, 132, dark, 0.96);
    body.setStrokeStyle(2, primary, 0.55);
    const shoulders = this.add.rectangle(0, -95, 118, 28, dark, 0.96);
    shoulders.setStrokeStyle(2, primary, 0.46);
    const head = this.add.circle(0, -144, 29, hero ? 0xc5b293 : 0x6f8b67, 1);
    head.setStrokeStyle(2, primary, 0.72);

    const emblem = this.add.text(0, -58, hero ? '✥' : this.enemyGlyph(), {
      fontFamily: 'Georgia, serif',
      fontSize: '42px',
      color: hero ? '#f1d99a' : '#ead7d7',
    }).setOrigin(0.5);

    const weapon = this.add.rectangle(hero ? 58 : -58, -58, 7, 132, 0xc9c3ae, 0.88)
      .setRotation(hero ? -0.32 : 0.32);
    const guard = this.add.rectangle(hero ? 58 : -58, -58, 35, 6, primary, 0.95)
      .setRotation(hero ? -0.32 : 0.32);

    container.add([aura, body, shoulders, head, emblem, weapon, guard]);
    if (hero) {
      this.heroAura = aura;
    } else {
      this.enemyAura = aura;
    }
    return container;
  }

  private async playEvent(event: BattleVisualEvent): Promise<void> {
    const actor = event.actor === 'enemy' ? this.enemy : this.hero;
    const target = event.actor === 'enemy' ? this.hero : this.enemy;

    switch (event.type) {
      case 'attack':
      case 'heavy':
        await this.lunge(actor, target, event.amount ?? 0, event.type === 'heavy');
        break;
      case 'block':
        await this.shieldPulse(actor, event.amount ?? 0);
        break;
      case 'heal':
        await this.healPulse(actor, event.amount ?? 0);
        break;
      case 'poison':
        await this.statusPulse(actor, event.amount ?? 0, '#86c66a');
        break;
      case 'bleed':
        await this.statusPulse(actor, event.amount ?? 0, '#d56a67');
        break;
      case 'buff':
        await this.statusPulse(actor, 0, '#a991df');
        break;
      case 'victory':
        await this.fall(this.enemy);
        break;
      case 'defeat':
        await this.fall(this.hero);
        break;
    }
  }

  private lunge(actor: Phaser.GameObjects.Container, target: Phaser.GameObjects.Container, amount: number, heavy: boolean): Promise<void> {
    return new Promise((resolve) => {
      const startX = actor.x;
      const direction = actor === this.hero ? 1 : -1;
      this.tweens.add({
        targets: actor,
        x: startX + direction * (heavy ? 116 : 78),
        duration: heavy ? 190 : 145,
        yoyo: true,
        ease: 'Quad.Out',
        onYoyo: () => {
          this.cameras.main.shake(heavy ? 180 : 110, heavy ? 0.008 : 0.004);
          this.flashAura(target, 0xe86f67);
          this.floatText(target.x, target.y - 206, `-${amount}`, '#ffd4cf');
        },
        onComplete: () => resolve(),
      });
    });
  }

  private shieldPulse(actor: Phaser.GameObjects.Container, amount: number): Promise<void> {
    return new Promise((resolve) => {
      const aura = actor === this.hero ? this.heroAura : this.enemyAura;
      aura.setFillStyle(0x76a9c8, 0.24);
      this.floatText(actor.x, actor.y - 206, `+${amount} ESCUDO`, '#bfe6ff');
      this.tweens.add({
        targets: aura,
        scale: 1.22,
        alpha: 0.75,
        duration: 250,
        yoyo: true,
        onComplete: () => {
          aura.setScale(1);
          aura.setAlpha(1);
          resolve();
        },
      });
    });
  }

  private healPulse(actor: Phaser.GameObjects.Container, amount: number): Promise<void> {
    return new Promise((resolve) => {
      this.floatText(actor.x, actor.y - 206, `+${amount}`, '#b8f0bd');
      this.flashAura(actor, 0x6bc47b);
      this.time.delayedCall(460, resolve);
    });
  }

  private statusPulse(actor: Phaser.GameObjects.Container, amount: number, color: string): Promise<void> {
    return new Promise((resolve) => {
      this.floatText(actor.x, actor.y - 206, amount ? `-${amount}` : 'EFEITO', color);
      this.time.delayedCall(420, resolve);
    });
  }

  private fall(actor: Phaser.GameObjects.Container): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: actor,
        alpha: 0.15,
        y: actor.y + 36,
        angle: actor === this.hero ? -7 : 7,
        duration: 800,
        ease: 'Sine.In',
        onComplete: () => resolve(),
      });
    });
  }

  private flashAura(target: Phaser.GameObjects.Container, color: number): void {
    const flash = this.add.circle(target.x, target.y - 72, 96, color, 0.2);
    flash.setStrokeStyle(3, color, 0.55);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.35,
      duration: 340,
      onComplete: () => flash.destroy(),
    });
  }

  private floatText(x: number, y: number, text: string, color: string): void {
    const label = this.add.text(x, y, text, {
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: '25px',
      fontStyle: 'bold',
      color,
      stroke: '#040706',
      strokeThickness: 5,
    }).setOrigin(0.5);
    this.floatingLayer.add(label);
    this.tweens.add({
      targets: label,
      y: y - 42,
      alpha: 0,
      duration: 720,
      ease: 'Cubic.Out',
      onComplete: () => label.destroy(),
    });
  }

  private themeTint(): number {
    const map: Record<StageDefinition['theme'], number> = {
      forest: 0x79b66e,
      ruins: 0x9a82be,
      mountain: 0x9eb8c6,
      moon: 0x7f6ab5,
      citadel: 0xc06d55,
    };
    return map[this.stage.theme];
  }

  private enemyColor(): number {
    const map: Record<StageDefinition['theme'], number> = {
      forest: 0x7f9d62,
      ruins: 0x8366a0,
      mountain: 0x7d8f96,
      moon: 0x74598f,
      citadel: 0x9a5447,
    };
    return map[this.stage.theme];
  }

  private enemyGlyph(): string {
    const map: Record<StageDefinition['theme'], string> = {
      forest: '☠',
      ruins: '☾',
      mountain: 'ᚱ',
      moon: '◉',
      citadel: '♛',
    };
    return map[this.stage.theme];
  }
}

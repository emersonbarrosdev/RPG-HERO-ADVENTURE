import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as Phaser from 'phaser';
import { StageDefinition } from '../../data/stages';
import { BattleVisualEvent } from '../../models/battle.model';
import { BattleScene } from '../../phaser/battle.scene';

@Component({
  selector: 'app-battle-canvas',
  templateUrl: './battle-canvas.component.html',
  styleUrls: ['./battle-canvas.component.scss'],
})
export class BattleCanvasComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) stage!: StageDefinition;
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  private game?: Phaser.Game;
  private scene?: BattleScene;

  ngAfterViewInit(): void {
    this.scene = new BattleScene(this.stage);
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: this.host.nativeElement,
      width: 1280,
      height: 520,
      backgroundColor: '#07100e',
      scene: [this.scene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        antialias: true,
        roundPixels: true,
      },
    });
  }

  async play(events: BattleVisualEvent[]): Promise<void> {
    if (!this.scene || events.length === 0) {
      return;
    }
    await this.scene.play(events);
  }

  ngOnDestroy(): void {
    this.game?.destroy(true);
  }
}

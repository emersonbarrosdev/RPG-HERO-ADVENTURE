import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-hero-adventure',
  templateUrl: './hero-adventure.component.html',
  styleUrls: ['./hero-adventure.component.scss'],
})
export class HeroAdventureComponent {
  constructor(public game: GameService, private router: Router) {}

  newGame(): void {
    this.game.newGame();
    this.router.navigate(['/champion']);
  }

  continueGame(): void {
    const state = this.game.snapshot;
    if (!state.heroId) {
      this.router.navigate(['/champion']);
      return;
    }
    if (state.runWon) {
      this.router.navigate(['/victory']);
      return;
    }
    if (state.pendingReward) {
      this.router.navigate(['/reward']);
      return;
    }
    if (state.battle && ['intro', 'player', 'enemy', 'defeat', 'victory'].includes(state.battle.phase)) {
      this.router.navigate(['/battle', state.battle.encounterId]);
      return;
    }
    this.router.navigate(['/campaign']);
  }
}

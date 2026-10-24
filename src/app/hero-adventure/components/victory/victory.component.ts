import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-victory',
  templateUrl: './victory.component.html',
  styleUrls: ['./victory.component.scss'],
})
export class VictoryComponent {
  constructor(public game: GameService, private router: Router) {
    if (!game.snapshot.runWon) this.router.navigate(['/']);
  }

  restart(): void {
    this.game.newGame();
    this.router.navigate(['/champion']);
  }
}

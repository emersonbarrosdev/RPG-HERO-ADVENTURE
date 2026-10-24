import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardDefinition } from '../../models/card.model';
import { RelicDefinition } from '../../models/relic.model';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-reward-screen',
  templateUrl: './reward-screen.component.html',
  styleUrls: ['./reward-screen.component.scss'],
})
export class RewardScreenComponent {
  constructor(public game: GameService, private router: Router) {
    if (!game.snapshot.pendingReward) this.router.navigate(['/campaign']);
  }

  get reward() {
    return this.game.snapshot.pendingReward;
  }

  card(id: string): CardDefinition {
    return this.game.getCardDefinition(id);
  }

  relic(id: string): RelicDefinition | undefined {
    return this.game.getRelic(id);
  }

  chooseCard(id: string | null): void {
    this.game.claimCard(id);
  }

  chooseRelic(id: string | null): void {
    this.game.claimRelic(id);
  }

  finish(): void {
    this.game.finishReward();
    this.router.navigate(['/campaign']);
  }
}

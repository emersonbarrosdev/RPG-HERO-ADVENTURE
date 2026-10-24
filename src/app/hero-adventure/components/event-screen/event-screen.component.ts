import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardDefinition, CardInstance } from '../../models/card.model';
import { CampaignNode } from '../../models/campaign.model';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-event-screen',
  templateUrl: './event-screen.component.html',
  styleUrls: ['./event-screen.component.scss'],
})
export class EventScreenComponent implements OnInit {
  node: CampaignNode | null = null;
  upgradeMode = false;

  constructor(public game: GameService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('nodeId');
    this.node = this.game.campaign.find((item) => item.id === id) ?? null;
    if (!this.node || this.node.index !== this.game.snapshot.currentNodeIndex || !['event', 'rest'].includes(this.node.type)) {
      this.router.navigate(['/campaign']);
    }
  }

  choose(choiceId: string): void {
    if (this.game.resolveEvent(choiceId)) this.router.navigate(['/campaign']);
  }

  canAfford(cost?: number): boolean {
    return (cost ?? 0) <= this.game.snapshot.gold;
  }

  heal(): void {
    this.game.restHeal();
    this.router.navigate(['/campaign']);
  }

  upgrade(instance: CardInstance): void {
    if (this.game.restUpgradeCard(instance.uid)) this.router.navigate(['/campaign']);
  }

  cardDef(instance: CardInstance): CardDefinition {
    return this.game.getCardDefinition(instance.cardId);
  }

  upgradable(): CardInstance[] {
    return this.game.snapshot.deck.filter((card) => !card.upgraded);
  }
}

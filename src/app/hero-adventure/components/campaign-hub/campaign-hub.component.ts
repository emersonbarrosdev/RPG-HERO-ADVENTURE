import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CAMPAIGN } from '../../data/campaign';
import { CardDefinition, CardInstance } from '../../models/card.model';
import { CampaignNode } from '../../models/campaign.model';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-campaign-hub',
  templateUrl: './campaign-hub.component.html',
  styleUrls: ['./campaign-hub.component.scss'],
})
export class CampaignHubComponent {
  campaign = CAMPAIGN;
  showDeck = false;

  constructor(public game: GameService, private router: Router) {}

  get node(): CampaignNode | null {
    return this.game.currentNode;
  }

  get deckPreview(): CardInstance[] {
    return this.game.snapshot.deck.slice(0, 8);
  }

  cardDef(instance: CardInstance): CardDefinition {
    return this.game.getCardDefinition(instance.cardId);
  }

  nodeState(node: CampaignNode): 'done' | 'current' | 'locked' {
    if (this.game.snapshot.completedNodeIds.includes(node.id)) return 'done';
    if (node.index === this.game.snapshot.currentNodeIndex) return 'current';
    return 'locked';
  }

  enterCurrent(): void {
    const node = this.node;
    if (!node) return;
    if (['battle', 'elite', 'boss'].includes(node.type)) this.router.navigate(['/battle', node.id]);
    else this.router.navigate(['/event', node.id]);
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }
}

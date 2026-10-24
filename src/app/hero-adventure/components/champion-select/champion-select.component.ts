import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CARDS } from '../../data/cards';
import { HEROES } from '../../data/heroes';
import { CardDefinition } from '../../models/card.model';
import { HeroDefinition } from '../../models/hero.model';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-champion-select',
  templateUrl: './champion-select.component.html',
  styleUrls: ['./champion-select.component.scss'],
})
export class ChampionSelectComponent {
  heroes = HEROES;
  selectedId = HEROES[0].id;

  constructor(private game: GameService, private router: Router) {}

  starterPreview(hero: HeroDefinition): CardDefinition[] {
    const unique = [...new Set(hero.starterDeck)];
    return unique.slice(0, 4).map((id) => CARDS.find((card) => card.id === id)).filter(Boolean) as CardDefinition[];
  }

  choose(hero: HeroDefinition): void {
    this.selectedId = hero.id;
  }

  confirm(): void {
    this.game.selectHero(this.selectedId);
    this.router.navigate(['/campaign']);
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BattleScreenComponent } from './hero-adventure/components/battle-screen/battle-screen.component';
import { CampaignHubComponent } from './hero-adventure/components/campaign-hub/campaign-hub.component';
import { CardViewComponent } from './hero-adventure/components/card-view/card-view.component';
import { ChampionSelectComponent } from './hero-adventure/components/champion-select/champion-select.component';
import { EventScreenComponent } from './hero-adventure/components/event-screen/event-screen.component';
import { HeroAdventureComponent } from './hero-adventure/components/hero-adventure/hero-adventure.component';
import { RewardScreenComponent } from './hero-adventure/components/reward-screen/reward-screen.component';
import { VictoryComponent } from './hero-adventure/components/victory/victory.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroAdventureComponent,
    ChampionSelectComponent,
    CampaignHubComponent,
    BattleScreenComponent,
    CardViewComponent,
    RewardScreenComponent,
    EventScreenComponent,
    VictoryComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

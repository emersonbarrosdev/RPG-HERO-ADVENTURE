import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattleScreenComponent } from './hero-adventure/components/battle-screen/battle-screen.component';
import { CampaignHubComponent } from './hero-adventure/components/campaign-hub/campaign-hub.component';
import { ChampionSelectComponent } from './hero-adventure/components/champion-select/champion-select.component';
import { EventScreenComponent } from './hero-adventure/components/event-screen/event-screen.component';
import { HeroAdventureComponent } from './hero-adventure/components/hero-adventure/hero-adventure.component';
import { RewardScreenComponent } from './hero-adventure/components/reward-screen/reward-screen.component';
import { VictoryComponent } from './hero-adventure/components/victory/victory.component';

const routes: Routes = [
  { path: '', component: HeroAdventureComponent },
  { path: 'champion', component: ChampionSelectComponent },
  { path: 'campaign', component: CampaignHubComponent },
  { path: 'battle/:nodeId', component: BattleScreenComponent },
  { path: 'event/:nodeId', component: EventScreenComponent },
  { path: 'reward', component: RewardScreenComponent },
  { path: 'victory', component: VictoryComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { ListPlayersPageResolver } from './players/list-players-page/list-players-page.resolver';
import { ListPlayersPageComponent } from './players/list-players-page/list-players-page.component';
import { CreatePlayerPageComponent } from './players/create-player-page/create-player-page.component';
import { CreateTeamPageComponent } from './teams/create-team-page/create-team-page.component';
import { ListTeamsPageResolver } from './teams/list-teams-page/list-teams-page.resolver';
import { ListTeamsPageComponent } from './teams/list-teams-page/list-teams-page.component';

export const routes: Routes = [
    { path: '', component: FrontpageComponent },
    {
        path: 'players',
        component: ListPlayersPageComponent,
        resolve: {
            players: ListPlayersPageResolver,
        },
    },
    {
        path: 'players/create',
        component: CreatePlayerPageComponent,
    },
    {
        path: 'teams',
        component: ListTeamsPageComponent,
        resolve: {
            teams: ListTeamsPageResolver,
        },
    },
    {
        path: 'teams/create',
        component: CreateTeamPageComponent,
    },
];

import { Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { ListPlayersPageResolver } from './players/list-players-page/list-players-page.resolver';
import { ListPlayersPageComponent } from './players/list-players-page/list-players-page.component';
import { CreatePlayerPageComponent } from './players/create-player-page/create-player-page.component';
import { CreateTeamPageComponent } from './teams/create-team-page/create-team-page.component';
import { ListTeamsPageResolver } from './teams/list-teams-page/list-teams-page.resolver';
import { ListTeamsPageComponent } from './teams/list-teams-page/list-teams-page.component';
import { CreateTeamMembershipPageComponent } from './teams/create-team-membership-page/create-team-membership-page.component';
import { ListTeamPlayersPageComponent } from './teams/list-team-players-page/list-team-players-page.component';
import { ListTeamPlayersPageResolver } from './teams/list-team-players-page/list-team-players-page.resolver';
import { UpdatePlayerPageComponent } from './players/update-player-page/update-player-page.component';
import { UpdatePlayerPageResolver } from './players/update-player-page/update-player-page.resolver';
import { UpdateTeamPageComponent } from './teams/update-team-page/update-team-page.component';
import { UpdateTeamPageResolver } from './teams/update-team-page/update-team-page.resolver';
import { UpdateTeamMembershipPageComponent } from './teams/update-team-membership-page/update-team-membership-page.component';
import { UpdateTeamMembershipPageResolver } from './teams/update-team-membership-page/update-team-membership-page.resolver';

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
        path: 'teams/:id/players',
        component: ListTeamPlayersPageComponent,
        resolve: {
            data: ListTeamPlayersPageResolver,
        },
    },
    {
        path: 'teams/create',
        component: CreateTeamPageComponent,
    },
    {
        path: 'teams/:id/create-membership',
        component: CreateTeamMembershipPageComponent,
    },
    {
        path: 'teams/:id/update',
        component: UpdateTeamPageComponent,
        resolve: {
            data: UpdateTeamPageResolver,
        },
    },
    {
        path: 'teams/:teamId/players/:playerId/update',
        component: UpdateTeamMembershipPageComponent,
        resolve: {
            data: UpdateTeamMembershipPageResolver,
        },
    },
    {
        path: 'players/:id/update',
        component: UpdatePlayerPageComponent,
        resolve: {
            data: UpdatePlayerPageResolver,
        },
    }
    
];

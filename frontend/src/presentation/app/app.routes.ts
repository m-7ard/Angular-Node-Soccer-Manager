import { Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { ListPlayersPageResolver } from './players/list-players-page/list-players-page.resolver';
import { ListPlayersPageComponent } from './players/list-players-page/list-players-page.component';
import { CreatePlayerPageComponent } from './players/create-player-page/create-player-page.component';
import { CreateTeamPageComponent } from './teams/create-team-page/create-team-page.component';
import { ListTeamsPageResolver } from './teams/list-teams-page/list-teams-page.resolver';
import { ListTeamsPageComponent } from './teams/list-teams-page/list-teams-page.component';
import { CreateTeamMembershipPageComponent } from './teams/read-team-page/create-team-membership/create-team-membership-page.component';
import { ListTeamPlayersPageComponent } from './teams/read-team-page/list-team-players-page/list-team-players-page.component';
import { UpdatePlayerPageComponent } from './players/update-player-page/update-player-page.component';
import { UpdatePlayerPageResolver } from './players/update-player-page/update-player-page.resolver';
import { UpdateTeamPageComponent } from './teams/update-team-page/update-team-page.component';
import { UpdateTeamPageResolver } from '../__obsolete/update-team-page.resolver';
import { UpdateTeamMembershipPageComponent } from './teams/update-team-membership-page/update-team-membership-page.component';
import { UpdateTeamMembershipPageResolver } from './teams/update-team-membership-page/update-team-membership-page.resolver';
import { NotFoundPageComponent } from './other/not-found-page.component';
import { InternalServerErrorPageComponent } from './other/internal-server-error-page.component copy';
import { UnknownErrorPageComponent } from './other/unknown-error-page.component copy 2';
import { ClientSideErrorPageComponent } from './other/client-side-error-page.component';
import { ReadTeamPageComponent } from './teams/read-team-page/read-team-page.component';
import { ReadTeamPageResolver } from './teams/read-team-page/read-team-page.resolver';
import { TeamHomePageComponent } from './teams/read-team-page/team-home-page/team-home-page.component';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';

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
            RESOLVER_DATA: ListTeamsPageResolver,
        },
    },
    {
        path: 'teams/create',
        component: CreateTeamPageComponent,
    },
    {
        path: 'teams/:teamId',
        component: ReadTeamPageComponent,
        resolve: {
            RESOLVER_DATA: ReadTeamPageResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: '',
                component: TeamHomePageComponent,
            },
            {
                path: 'update',
                component: UpdateTeamPageComponent,
            },
            {
                path: 'players/add',
                component: CreateTeamMembershipPageComponent,
            },
            {
                path: 'players',
                component: ListTeamPlayersPageComponent,
            },
            {
                path: 'players/:playerId/update',
                component: UpdateTeamMembershipPageComponent,
                resolve: {
                    [RESOLVER_DATA_KEY]: UpdateTeamMembershipPageResolver
                }
            },
        ],
    },
    {
        path: 'players/:id/update',
        component: UpdatePlayerPageComponent,
        resolve: {
            data: UpdatePlayerPageResolver,
        },
    },

    { path: 'not-found', component: NotFoundPageComponent },
    { path: 'internal-server-error', component: InternalServerErrorPageComponent },
    { path: 'unkown-error', component: UnknownErrorPageComponent },
    { path: 'client-side-error', component: ClientSideErrorPageComponent },
    { path: '**', redirectTo: 'not-found' },
];

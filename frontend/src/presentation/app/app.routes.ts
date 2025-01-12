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
import { UpdateTeamMembershipPageComponent } from './teams/update-team-membership-page/update-team-membership-page.component';
import { UpdateTeamMembershipPageResolver } from './teams/update-team-membership-page/update-team-membership-page.resolver';
import { NotFoundPageComponent } from './other/not-found-page.component';
import { InternalServerErrorPageComponent } from './other/internal-server-error-page.component copy';
import { UnknownErrorPageComponent } from './other/unknown-error-page.component copy 2';
import { ClientSideErrorPageComponent } from './other/client-side-error-page.component';
import { TeamLayoutPageComponent } from './teams/read-team-page/team-layout-page.component';
import { TeamLayoutPageResolver } from './teams/read-team-page/team-layout-page.resolver';
import { TeamDetailsPageComponent } from './teams/read-team-page/team-details-page/team-details-page.component';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { RegisterUserPageComponent } from './users/register-user-page/register-user-page.component';
import { LoginUserPageComponent } from './users/login-user-page/login-user-page.component';
import { FrontpageResolver } from './frontpage/frontpage.resolver';
import { AuthGuard } from '../guards/auth-guard';
import { PageDoesNotExistPageComponent } from './other/page-does-not-exist';
import { ListMatchesPageComponent } from './matches/list-matches-page/list-matches-page.component';
import { ListMatchesPageResolver } from './matches/list-matches-page/list-matches-page.resolver';
import { ScheduleMatchPageComponent } from './matches/schedule-match-page/schedule-match-page.component';
import { MarkInProgressPageComponent } from './matches/match-page-layout/pages/mark-in-progress-page/mark-in-progress-page.component';
import { MarkCompletedPageComponent } from './matches/match-page-layout/pages/mark-completed-page/mark-completed-page.component';
import { MarkCancelledPageComponent } from './matches/match-page-layout/pages/mark-cancelled-page/mark-cancelled-page.component';
import { RecordGoalPageComponent } from './matches/match-page-layout/pages/record-goal-page/record-goal-page.component';
import { MatchPageLayoutResolver } from './matches/match-page-layout/match-page-layout.resolver';
import { MatchPageLayoutComponent } from './matches/match-page-layout/match-page-layout.component';
import { MatchDetailsPageComponent } from './matches/match-page-layout/pages/match-details-page/match-details-page.component';

export const routes: Routes = [
    // Frontpage
    {
        path: '',
        component: FrontpageComponent,
        resolve: { [RESOLVER_DATA_KEY]: FrontpageResolver },
    },

    // Players Module
    {
        path: 'players',
        children: [
            {
                path: '',
                component: ListPlayersPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: ListPlayersPageResolver },
                canActivate: [AuthGuard],
            },
            {
                path: 'create',
                component: CreatePlayerPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: ':id/update',
                component: UpdatePlayerPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: UpdatePlayerPageResolver },
                canActivate: [AuthGuard],
            },
        ],
    },

    // Teams Module
    {
        path: 'teams',
        children: [
            {
                path: '',
                component: ListTeamsPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: ListTeamsPageResolver },
                canActivate: [AuthGuard],
            },
            {
                path: 'create',
                component: CreateTeamPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: ':teamId',
                component: TeamLayoutPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: TeamLayoutPageResolver },
                runGuardsAndResolvers: 'always',
                canActivate: [AuthGuard],
                children: [
                    { path: '', component: TeamDetailsPageComponent },
                    { path: 'update', component: UpdateTeamPageComponent },
                    { path: 'players/add', component: CreateTeamMembershipPageComponent },
                    { path: 'players', component: ListTeamPlayersPageComponent },
                    {
                        path: 'players/:playerId/update',
                        component: UpdateTeamMembershipPageComponent,
                        resolve: { [RESOLVER_DATA_KEY]: UpdateTeamMembershipPageResolver },
                    },
                ],
            },
        ],
    },

    // Users Module
    {
        path: 'users',
        children: [
            { path: 'register', component: RegisterUserPageComponent },
            { path: 'login', component: LoginUserPageComponent },
        ],
    },

    // Matches Module
    {
        path: 'matches',
        children: [
            {
                path: '',
                component: ListMatchesPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: ListMatchesPageResolver },
                canActivate: [AuthGuard],
            },
            {
                path: 'schedule',
                component: ScheduleMatchPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: ':matchId',
                component: MatchPageLayoutComponent,
                resolve: { [RESOLVER_DATA_KEY]: MatchPageLayoutResolver },
                runGuardsAndResolvers: 'always',
                canActivate: [AuthGuard],
                children: [
                    { path: "", component: MatchDetailsPageComponent },
                    {
                        path: 'mark-in-progress',
                        component: MarkInProgressPageComponent,
                    },
                    {
                        path: 'mark-completed',
                        component: MarkCompletedPageComponent,
                    },
                    {
                        path: 'mark-cancelled',
                        component: MarkCancelledPageComponent,
                    },
                    {
                        path: 'record-goal',
                        component: RecordGoalPageComponent,
                    },
                ]
            }
        ],
    },

    // Error Pages
    {
        path: 'not-found',
        component: NotFoundPageComponent,
    },
    {
        path: 'page-does-not-exist',
        component: PageDoesNotExistPageComponent,
    },
    {
        path: 'internal-server-error',
        component: InternalServerErrorPageComponent,
    },
    {
        path: 'unknown-error',
        component: UnknownErrorPageComponent,
    },
    {
        path: 'client-side-error',
        component: ClientSideErrorPageComponent,
    },

    // Catch-All
    { path: '**', redirectTo: 'page-does-not-exist' },
];

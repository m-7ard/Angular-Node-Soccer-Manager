import { Routes } from '@angular/router';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { CreateTeamMembershipPageComponent } from './teams/team-layout/create-team-membership/create-team-membership-page.component';
import { ListTeamPlayersPageComponent } from './teams/team-layout/list-team-memberships-page/list-team-players-page.component';
import { TeamDetailsPageComponent } from './teams/team-layout/team-details-page/team-details-page.component';
import { TeamDetailsPageResolver } from './teams/team-layout/team-details-page/team-details-page.resolver';
import { TeamLayoutPageComponent } from './teams/team-layout/team-layout-page.component';
import { TeamLayoutPageResolver } from './teams/team-layout/team-layout-page.resolver';
import { UpdateTeamPageComponent } from './teams/team-layout/update-team-page/update-team-page.component';
import { teamMembershipRoutes } from './app.routes.team-detail.membership-detail';
import { DeleteTeamPageComponent } from './teams/team-layout/delete-team-page/delete-team-page.component';
import { AuthGuard } from '../guards/auth-guard';

export const teamDetailRoutes: Routes = [
    {
        path: '',
        component: TeamLayoutPageComponent,
        resolve: { [RESOLVER_DATA_KEY]: TeamLayoutPageResolver },
        runGuardsAndResolvers: 'always',
        data: { breadcrumb: null },
        children: [
            {
                path: 'delete',
                component: DeleteTeamPageComponent,
                data: { breadcrumb: 'Delete' },
                canActivate: [AuthGuard],
            },
            {
                path: 'memberships',
                component: ListTeamPlayersPageComponent,
                data: { breadcrumb: 'Memberships' },
            },
            {
                path: 'memberships/add',
                component: CreateTeamMembershipPageComponent,
                data: { breadcrumb: 'Create Membership' },
                canActivate: [AuthGuard],
            },
            {
                path: '',
                component: TeamDetailsPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: TeamDetailsPageResolver },
            },
            {
                path: 'update',
                component: UpdateTeamPageComponent,
                data: { breadcrumb: 'Update' },
                canActivate: [AuthGuard],
            },
        ],
    },
    {
        path: 'memberships',
        data: { breadcrumb: 'Memberships' },
        children: teamMembershipRoutes,
    },
];

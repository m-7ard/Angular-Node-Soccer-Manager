import { Routes } from '@angular/router';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { TeamMembershipHistoriesPageComponent } from './teams/team-membership-layout/team-membership-histories-page/team-membership-histories-page.component';
import { TeamMembershipHistoriesPageResolver } from './teams/team-membership-layout/team-membership-histories-page/team-membership-histories-page.resolver';
import { TeamMembershipDetailsPageComponent } from './teams/team-membership-layout/team-membership-details-page/team-membership-details-page.component';
import { TeamMembershipLayoutComponent } from './teams/team-membership-layout/team-membership-layout.component';
import { TeamMembershipLayoutPageResolver } from './teams/team-membership-layout/team-membership-layout.resolver';
import { UpdateTeamMembershipPageComponent } from './teams/team-membership-layout/update-team-membership-page/update-team-membership-page.component';
import { UpdateTeamMembershipPageResolver } from './teams/team-membership-layout/update-team-membership-page/update-team-membership-page.resolver';
import { teamMembershipHistoryDetailRoutes } from './app.routes.team-detail.membership-detail.history-detail';
import { CreateTeamMembershipHistoryPageComponent } from './teams/team-membership-layout/create-team-membership-history-page/create-team-membership-history-page.component';
import { AuthGuard } from '../guards/auth-guard';
import { DeleteTeamMembershipPageComponent } from './teams/team-membership-layout/delete-team-membership-page/delete-team-membership-page.component';

export const teamMembershipRoutes: Routes = [
    {
        path: ':teamMembershipId',
        data: { breadcrumb: ':teamMembershipId' },
        children: [
            {
                path: '',
                component: TeamMembershipLayoutComponent,
                resolve: { [RESOLVER_DATA_KEY]: TeamMembershipLayoutPageResolver },
                runGuardsAndResolvers: 'always',
                data: { breadcrumb: null },
                children: [
                    {
                        path: '',
                        component: TeamMembershipDetailsPageComponent,
                        data: { breadcrumb: null },
                    },
                    {
                        path: 'update',
                        component: UpdateTeamMembershipPageComponent,
                        resolve: { [RESOLVER_DATA_KEY]: UpdateTeamMembershipPageResolver },
                        data: { breadcrumb: 'Update' },
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'histories',
                        component: TeamMembershipHistoriesPageComponent,
                        resolve: { [RESOLVER_DATA_KEY]: TeamMembershipHistoriesPageResolver },
                        data: { breadcrumb: 'Histories' },
                    },
                    {
                        path: 'histories/create',
                        component: CreateTeamMembershipHistoryPageComponent,
                        data: { breadcrumb: 'Create' },
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'delete',
                        component: DeleteTeamMembershipPageComponent,
                        data: { breadcrumb: 'Delete' },
                        canActivate: [AuthGuard],
                    }
                ],
            },
            {
                path: 'histories',
                children: teamMembershipHistoryDetailRoutes,
                data: { breadcrumb: 'Histories' },
            },
        ],
    },
];

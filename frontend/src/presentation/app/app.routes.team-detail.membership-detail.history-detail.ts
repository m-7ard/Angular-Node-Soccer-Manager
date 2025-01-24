import { Routes } from '@angular/router';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { TeamMembershipHistoryLayoutComponent } from './teams/team-membership-history-layout/team-membership-history-layout.component';
import { TeamMembershipHistoryLayoutResolver } from './teams/team-membership-history-layout/team-membership-history-layout.resolver';
import { TeamMembershipHistoryDetailsPageComponent } from './teams/team-membership-history-layout/team-membership-history-details-page/team-membership-history-details-page.component';
import { UpdateTeamMembershipHistoryPageComponent } from './teams/team-membership-history-layout/update-team-membership-history-page/update-team-membership-history-page.component';
import { AuthGuard } from '../guards/auth-guard';
import { DeleteTeamMembershipHistoryPageComponent } from './teams/team-membership-history-layout/delete-team-membership-history-page/delete-team-membership-history-page.component';

export const teamMembershipHistoryDetailRoutes: Routes = [
    {
        path: ':teamMembershipHistoryId',
        component: TeamMembershipHistoryLayoutComponent,
        resolve: { [RESOLVER_DATA_KEY]: TeamMembershipHistoryLayoutResolver },
        runGuardsAndResolvers: 'always',
        data: { breadcrumb: ':teamMembershipHistoryId' },
        children: [
            {
                path: '',
                component: TeamMembershipHistoryDetailsPageComponent,
                data: { breadcrumb: null },
            },
            {
                path: 'update',
                component: UpdateTeamMembershipHistoryPageComponent,
                data: { breadcrumb: 'Update' },
                canActivate: [AuthGuard],
            },
            {
                path: 'delete',
                component: DeleteTeamMembershipHistoryPageComponent,
                data: { breadcrumb: 'Delete' },
                canActivate: [AuthGuard],
            },
        ],
    },
];

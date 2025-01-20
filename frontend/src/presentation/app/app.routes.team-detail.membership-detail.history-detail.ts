import { Routes } from '@angular/router';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { TeamMembershipHistoryLayoutComponent } from './teams/team-membership-history-layout/team-membership-history-layout.component';
import { TeamMembershipHistoryLayoutResolver } from './teams/team-membership-history-layout/team-membership-history-layout.resolver';
import { TeamMembershipHistoryDetailsPageComponent } from './teams/team-membership-history-layout/team-membership-history-details-page/team-membership-history-details-page.component';

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
        ],
    },
];

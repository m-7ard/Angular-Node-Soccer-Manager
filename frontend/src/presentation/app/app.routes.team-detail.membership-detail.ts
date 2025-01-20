import { Routes } from "@angular/router";
import { RESOLVER_DATA_KEY } from "../utils/RESOLVER_DATA";
import { TeamMembershipHistoriesPageComponent } from "./teams/team-membership-layout/team-membership-histories-page/team-membership-histories-page.component";
import { TeamMembershipHistoriesPageResolver } from "./teams/team-membership-layout/team-membership-histories-page/team-membership-histories-page.resolver";
import { TeamPlayerDetailsPageComponent } from "./teams/team-membership-layout/team-player-details-page/team-player-details-page.component";
import { TeamPlayerLayoutComponent } from "./teams/team-membership-layout/team-player-layout.component";
import { TeamPlayerLayoutPageResolver } from "./teams/team-membership-layout/team-player-layout.resolver";
import { UpdateTeamMembershipPageComponent } from "./teams/team-membership-layout/update-team-membership-page/update-team-membership-page.component";
import { UpdateTeamMembershipPageResolver } from "./teams/team-membership-layout/update-team-membership-page/update-team-membership-page.resolver";
import { teamMembershipHistoryDetailRoutes } from "./app.routes.team-detail.membership-detail.history-detail";

export const teamMembershipRoutes: Routes = [
    {
        path: ':teamMembershipId',
        component: TeamPlayerLayoutComponent,
        resolve: { [RESOLVER_DATA_KEY]: TeamPlayerLayoutPageResolver },
        runGuardsAndResolvers: 'always',
        data: { breadcrumb: ':teamMembershipId' },
        children: [
            {
                path: '',
                component: TeamPlayerDetailsPageComponent,
                data: { breadcrumb: null },
            },
            {
                path: 'update',
                component: UpdateTeamMembershipPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: UpdateTeamMembershipPageResolver },
                data: { breadcrumb: 'Update' },
            },
            {
                path: 'histories',
                component: TeamMembershipHistoriesPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: TeamMembershipHistoriesPageResolver },
                data: { breadcrumb: 'Histories' },
            },
        ],
    },
    {
        path: ':teamMembershipId/histories',
        children: teamMembershipHistoryDetailRoutes
    }
];
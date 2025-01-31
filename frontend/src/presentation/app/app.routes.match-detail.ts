import { Routes } from '@angular/router';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { MatchPageLayoutComponent } from './matches/match-page-layout/match-page-layout.component';
import { MatchPageLayoutResolver } from './matches/match-page-layout/match-page-layout.resolver';
import { MarkCancelledPageComponent } from './matches/match-page-layout/pages/mark-cancelled-page/mark-cancelled-page.component';
import { MarkCompletedPageComponent } from './matches/match-page-layout/pages/mark-completed-page/mark-completed-page.component';
import { MarkInProgressPageComponent } from './matches/match-page-layout/pages/mark-in-progress-page/mark-in-progress-page.component';
import { MatchDetailsPageComponent } from './matches/match-page-layout/pages/match-details-page/match-details-page.component';
import { RecordGoalPageComponent } from './matches/match-page-layout/pages/record-goal-page/record-goal-page.component';
import { AuthGuard } from '../guards/auth-guard';
import { DeleteMatchPageComponent } from './matches/match-page-layout/pages/delete-match-page/delete-match-page.component';

export const matchDetailRoutes: Routes = [
    {
        path: '',
        component: MatchPageLayoutComponent,
        resolve: { [RESOLVER_DATA_KEY]: MatchPageLayoutResolver },
        runGuardsAndResolvers: 'always',
        data: { breadcrumb: null },
        children: [
            {
                path: '',
                component: MatchDetailsPageComponent,
                data: { breadcrumb: null },
            },
            {
                path: 'mark-in-progress',
                component: MarkInProgressPageComponent,
                data: { breadcrumb: 'Mark In Progress' },
                canActivate: [AuthGuard],
            },
            {
                path: 'mark-completed',
                component: MarkCompletedPageComponent,
                data: { breadcrumb: 'Mark Completed' },
                canActivate: [AuthGuard],
            },
            {
                path: 'mark-cancelled',
                component: MarkCancelledPageComponent,
                data: { breadcrumb: 'Mark Cancelled' },
                canActivate: [AuthGuard],
            },
            {
                path: 'record-goal',
                component: RecordGoalPageComponent,
                data: { breadcrumb: 'Record Goal' },
                canActivate: [AuthGuard],
            },
            {
                path: 'delete',
                component: DeleteMatchPageComponent,
                data: { breadcrumb: 'Delete' },
                canActivate: [AuthGuard],
            },
        ],
    },
];

import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { MatchesLayoutComponent } from './matches/matches-layout/matches-layout.component';
import { ListMatchesPageComponent } from './matches/matches-layout/pages/list-matches-page/list-matches-page.component';
import { ListMatchesPageResolver } from './matches/matches-layout/pages/list-matches-page/list-matches-page.resolver';
import { ScheduleMatchPageComponent } from './matches/matches-layout/pages/schedule-match-page/schedule-match-page.component';

export const matchesRoutes: Routes = [
    {
        path: 'matches',
        data: { breadcrumb: 'Matches' },
        children: [
            {
                path: '',
                component: MatchesLayoutComponent,
                data: { breadcrumb: null },
                children: [
                    {
                        path: '',
                        component: ListMatchesPageComponent,
                        resolve: { [RESOLVER_DATA_KEY]: ListMatchesPageResolver },
                        data: { breadcrumb: null },
                    },
                    {
                        path: 'schedule',
                        component: ScheduleMatchPageComponent,
                        canActivate: [AuthGuard],
                        data: { breadcrumb: 'Schedule' },
                    },
                ],
            },
            {
                path: ':matchId',
                data: { breadcrumb: ":matchId" },
                loadChildren: () => import('./app.routes.match-detail').then(m => m.matchDetailRoutes)
            },
        ],
    },
];
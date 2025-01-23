import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard';
import { UpdatePlayerPageComponent } from './players/player-detail-layout/pages/update-player-page/update-player-page.component';
import { PlayerDetailsPageComponent } from './players/player-detail-layout/pages/player-details-page/player-details-page.component';
import { PlayerDetailLayoutComponent } from './players/player-detail-layout/player-detail-layout.component';
import { PlayerDetailLayoutResolver } from './players/player-detail-layout/player-detail-layout.resolver';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { PlayerDetailsPageResolver } from './players/player-detail-layout/pages/player-details-page/player-details-page.resolver';

export const playerDetailRoutes: Routes = [
    {
        path: '',
        resolve: { [RESOLVER_DATA_KEY]: PlayerDetailLayoutResolver },
        component: PlayerDetailLayoutComponent,
        data: { breadcrumb: null },
        children: [
            {
                path: '',
                component: PlayerDetailsPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: PlayerDetailsPageResolver },
                data: { breadcrumb: null },
            },
            {
                path: 'update',
                component: UpdatePlayerPageComponent,
                canActivate: [AuthGuard],
                data: { breadcrumb: 'Update' },
            },
        ],
    },
];

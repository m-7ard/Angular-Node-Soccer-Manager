import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { UpdatePlayerPageComponent } from './players/player-detail-layout/pages/update-player-page/update-player-page.component';
import { UpdatePlayerPageResolver } from './players/player-detail-layout/pages/update-player-page/update-player-page.resolver';
import { PlayersLayoutResolver } from './players/players-layout/players-layout-page.resolver';

export const playerDetailRoutes: Routes = [
    {
        path: '',
        resolve: PlayersLayoutResolver,
        children: [
            
            {
                path: ':id/update',
                component: UpdatePlayerPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: UpdatePlayerPageResolver },
                canActivate: [AuthGuard],
            },
        ],
    },
];

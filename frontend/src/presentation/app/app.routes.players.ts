import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { CreatePlayerPageComponent } from './players/players-layout/pages/create-player-page/create-player-page.component';
import { ListPlayersPageComponent } from './players/list-players-page/list-players-page.component';
import { ListPlayersPageResolver } from './players/list-players-page/list-players-page.resolver';
import { UpdatePlayerPageComponent } from './players/player-detail-layout/pages/update-player-page/update-player-page.component';
import { UpdatePlayerPageResolver } from './players/player-detail-layout/pages/update-player-page/update-player-page.resolver';
import { PlayersLayoutComponent } from './players/players-layout/players-layout.component';

export const playersRoutes: Routes = [
    {
        path: 'players',
        data: { breadcrumb: 'Players' },
        children: [
            {
                path: '',
                component: PlayersLayoutComponent,
                data: { breadcrumb: null },
                children: [
                    {
                        path: '',
                        component: ListPlayersPageComponent,
                        resolve: { [RESOLVER_DATA_KEY]: ListPlayersPageResolver },
                        data: { breadcrumb: 'List' },
                    },
                    {
                        path: 'create',
                        component: CreatePlayerPageComponent,
                        canActivate: [AuthGuard],
                        data: { breadcrumb: 'Create' },
                    },
                ],
            },
            {
                path: ':id',
                component: UpdatePlayerPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: UpdatePlayerPageResolver },
                canActivate: [AuthGuard],
                data: { breadcrumb: ':id' },
                children: [
                loadChildren: () => import('./app.routes.match-detail').then(m => m.matchDetailRoutes)

                ]
            },
        ],
    },
];

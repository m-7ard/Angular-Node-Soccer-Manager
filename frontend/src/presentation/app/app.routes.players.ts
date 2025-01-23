import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { CreatePlayerPageComponent } from './players/players-layout/pages/create-player-page/create-player-page.component';
import { ListPlayersPageComponent } from './players/list-players-page/list-players-page.component';
import { ListPlayersPageResolver } from './players/list-players-page/list-players-page.resolver';
import { PlayersLayoutComponent } from './players/players-layout/players-layout.component';
import { playerDetailRoutes } from './app.routes.player-detail';

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
                data: { breadcrumb: ':id' },
                children: playerDetailRoutes,
            },
        ],
    },
];

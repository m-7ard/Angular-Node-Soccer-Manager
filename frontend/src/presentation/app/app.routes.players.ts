import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth-guard";
import { RESOLVER_DATA_KEY } from "../utils/RESOLVER_DATA";
import { CreatePlayerPageComponent } from "./players/create-player-page/create-player-page.component";
import { ListPlayersPageComponent } from "./players/list-players-page/list-players-page.component";
import { ListPlayersPageResolver } from "./players/list-players-page/list-players-page.resolver";
import { UpdatePlayerPageComponent } from "./players/update-player-page/update-player-page.component";
import { UpdatePlayerPageResolver } from "./players/update-player-page/update-player-page.resolver";

export const playersRoutes: Routes = [
    {
        path: 'players',
        children: [
            {
                path: '',
                component: ListPlayersPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: ListPlayersPageResolver },
            },
            {
                path: 'create',
                component: CreatePlayerPageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: ':id/update',
                component: UpdatePlayerPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: UpdatePlayerPageResolver },
                canActivate: [AuthGuard],
            },
        ],
    },
];
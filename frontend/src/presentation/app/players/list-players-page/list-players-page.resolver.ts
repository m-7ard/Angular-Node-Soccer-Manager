import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import { Observable } from 'rxjs';
import Player from '../../../models/Player';

export interface IListPlayersResolverData {
    players: Player[]
}

@Injectable({ providedIn: 'root' })
export class ListPlayersPageResolver implements Resolve<Player[]> {
    constructor(private _playerDataAccess: PlayerDataAccessService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<Player[]> | Promise<Player[]> | Player[] {
        return this._playerDataAccess.listPlayers();
    }
}

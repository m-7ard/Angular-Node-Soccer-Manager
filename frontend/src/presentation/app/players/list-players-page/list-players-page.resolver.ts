import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import { catchError, map, Observable } from 'rxjs';
import Player from '../../../models/Player';
import PlayerMapper from '../../../mappers/PlayerMapper';
import getRoutableException from '../../../utils/getRoutableException';

export interface IListPlayersResolverData {
    players: Player[];
}

@Injectable({ providedIn: 'root' })
export class ListPlayersPageResolver implements Resolve<IListPlayersResolverData> {
    constructor(private _playerDataAccess: PlayerDataAccessService) {}

    resolve(): Observable<IListPlayersResolverData> {
        return this._playerDataAccess.listPlayers({ name: null, limitBy: null }).pipe(
            map((response) => ({ players: response.players.map(PlayerMapper.apiModelToDomain) })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}

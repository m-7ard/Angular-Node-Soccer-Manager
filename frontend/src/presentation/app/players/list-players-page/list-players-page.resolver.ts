import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import { map, Observable } from 'rxjs';
import Player from '../../../models/Player';
import PlayerMapper from '../../../mappers/PlayerMapper';

export interface IListPlayersResolverData {
    players: Player[];
}

@Injectable({ providedIn: 'root' })
export class ListPlayersPageResolver implements Resolve<Player[]> {
    constructor(private _playerDataAccess: PlayerDataAccessService) {}

    resolve(): Observable<Player[]> {
        return this._playerDataAccess.listPlayers({ name: null }).pipe(
            map((response) => {
                return response.players.map(PlayerMapper.apiModelToDomain);
            }),
        );
    }
}

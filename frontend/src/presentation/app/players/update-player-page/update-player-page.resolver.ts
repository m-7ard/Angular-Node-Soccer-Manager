import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import Player from '../../../models/Player';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import PlayerMapper from '../../../mappers/PlayerMapper';

export interface IUpdatePlayerResolverData {
    player: Player;
    id: string;
}

@Injectable({ providedIn: 'root' })
export class UpdatePlayerPageResolver implements Resolve<IUpdatePlayerResolverData> {
    constructor(
        private _playerDataAccess: PlayerDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IUpdatePlayerResolverData> {
        const id = route.paramMap.get('id')

        if (id == null) {
            throw new Error('implement a 404');
        }

        return this._playerDataAccess.read(id, {}).pipe(
            map((response) => {
                return {
                    player: PlayerMapper.apiModelToDomain(response.player),
                    id: id
                }
            })
        );
    }
}

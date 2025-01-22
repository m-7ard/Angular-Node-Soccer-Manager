import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import getRoutableException from '../../../utils/getRoutableException';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';
import Player from '../../../models/Player';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import PlayerMapper from '../../../mappers/PlayerMapper';

export interface IPlayersLayoutResolverData {
    player: Player;
}

@Injectable({ providedIn: 'root' })
export class PlayersLayoutResolver implements Resolve<IPlayersLayoutResolverData> {
    constructor(private playerDataAccess: PlayerDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IPlayersLayoutResolverData> {
        let id = route.paramMap.get('id');

        if (id == null) {
            throw new ClientSideErrorException('Player Layout: id parameter is null.');
        }

        const playerData = this.playerDataAccess.read(id, {}).pipe(
            map((response) => ({
                player: PlayerMapper.apiModelToDomain(response.player),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );

        return playerData;
    }
}

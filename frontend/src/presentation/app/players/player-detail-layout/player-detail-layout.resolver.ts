import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';
import PlayerMapper from '../../../mappers/PlayerMapper';
import Player from '../../../models/Player';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';

export interface IPlayerDetailLayoutResolverData {
    player: Player;
}

@Injectable({ providedIn: 'root' })
export class PlayerDetailLayoutResolver implements Resolve<IPlayerDetailLayoutResolverData> {
    constructor(private playerDataAccess: PlayerDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IPlayerDetailLayoutResolverData> {
        const id = route.paramMap.get('id');

        if (id == null) {
            throw new ClientSideErrorException('Update Player Page: id parameter is null.');
        }

        return this.playerDataAccess.read(id, {}).pipe(
            map((response) => {
                return {
                    player: PlayerMapper.apiModelToDomain(response.player),
                };
            }),
        );
    }
}

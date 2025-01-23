import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../../../models/Team';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import getRoutableException from '../../../../../utils/getRoutableException';
import TeamMapper from '../../../../../mappers/TeamMapper';
import { PlayerDataAccessService } from '../../../../../services/data-access/player-data-access.service';

export interface IPlayerDetailsPageResolverData {
    currentTeams: Team[];
    formerTeams: Team[];
}

@Injectable({ providedIn: 'root' })
export class PlayerDetailsPageResolver implements Resolve<IPlayerDetailsPageResolverData> {
    constructor(
        private playerDataAccess: PlayerDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IPlayerDetailsPageResolverData> {
        let id = route.parent?.paramMap.get('id');

        if (id == null) {
            throw new ClientSideErrorException('Player Details Page: id parameter is null.');
        }

        return this.playerDataAccess.readFull(id, {}).pipe(
            map((response) => ({
                currentTeams: response.currentTeams.map(TeamMapper.apiModelToDomain),
                formerTeams: response.formerTeams.map(TeamMapper.apiModelToDomain),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}

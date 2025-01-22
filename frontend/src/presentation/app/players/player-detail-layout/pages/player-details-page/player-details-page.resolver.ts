import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../../../models/Team';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import getRoutableException from '../../../../../utils/getRoutableException';
import { TeamDataAccessService } from '../../../../../services/data-access/team-data-access.service';
import TeamMapper from '../../../../../mappers/TeamMapper';

export interface IPlayerDetailsPageResolverData {
    teams: Team[];
}

@Injectable({ providedIn: 'root' })
export class PlayerDetailsPageResolver implements Resolve<IPlayerDetailsPageResolverData> {
    constructor(
        private matchDataAccess: MatchDataAccessService,
        private teamDataAccess: TeamDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IPlayerDetailsPageResolverData> {
        let id = route.parent?.paramMap.get('id');

        if (id == null) {
            throw new ClientSideErrorException('Player Details Page: id parameter is null.');
        }

        return this.teamDataAccess.listTeams({ teamMembershipPlayerId: id, limitBy: null, name: null }).pipe(
            map((response) => ({
                teams: response.teams.map(TeamMapper.apiModelToDomain),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}

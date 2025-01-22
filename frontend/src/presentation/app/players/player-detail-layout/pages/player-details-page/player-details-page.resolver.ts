import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../../../models/Team';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import MatchEvent from '../../../../../models/MatchEvent';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import MatchMapper from '../../../../../mappers/MatchMapper';
import getRoutableException from '../../../../../utils/getRoutableException';

export interface ITeamDetailsPageResolverData {
    goals: MatchEvent[];
    teams: Team[];
}

@Injectable({ providedIn: 'root' })
export class TeamDetailsPageResolver implements Resolve<ITeamDetailsPageResolverData> {
    constructor(private matchDataAccess: MatchDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITeamDetailsPageResolverData> {
        let teamId = route.parent?.paramMap.get('teamId');
        
        if (teamId == null) {
            throw new ClientSideErrorException('Team Details Page: teamId parameter is null.');
        }

        return this.matchDataAccess.listMatches({
            limitBy: null,
            scheduledDate: null,
            status: null,
            teamId: teamId
        }).pipe(
            map((response) => ({
                matches: response.matches.map(MatchMapper.apiModelToDomain)
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}

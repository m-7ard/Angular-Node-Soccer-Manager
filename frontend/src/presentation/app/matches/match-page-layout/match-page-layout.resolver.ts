import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import getRoutableException from '../../../utils/getRoutableException';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';
import { MatchDataAccessService } from '../../../services/data-access/match-data-access.service';
import Match from '../../../models/Match';
import MatchEvent from '../../../models/MatchEvent';
import MatchMapper from '../../../mappers/MatchMapper';
import MatchEventMapper from '../../../mappers/MatchEventMapper';

export interface IMatchPageLayoutResolverData {
    match: Match;
    matchEvents: MatchEvent[];
}

@Injectable({ providedIn: 'root' })
export class MatchPageLayoutResolver implements Resolve<IMatchPageLayoutResolverData> {
    constructor(private matchDataAccess: MatchDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IMatchPageLayoutResolverData> {
        let matchId = route.paramMap.get('matchId');
        
        if (matchId == null) {
            throw new ClientSideErrorException('Match Page Layout: matchId parameter is null.');
        }

        return this.matchDataAccess.readMatch(matchId, {}).pipe(
            map((response) => ({
                match: MatchMapper.apiModelToDomain(response.match),
                matchEvents: response.matchEvents.map(MatchEventMapper.apiModelToDomain),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}

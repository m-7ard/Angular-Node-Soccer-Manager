import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import getRoutableException from '../../../../../utils/getRoutableException';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import Match from '../../../../../models/Match';
import MatchMapper from '../../../../../mappers/MatchMapper';

export interface IListMatchesResolverData {
    matches: Match[];
}

@Injectable({ providedIn: 'root' })
export class ListMatchesPageResolver implements Resolve<IListMatchesResolverData> {
    constructor(private _matchDataAccess: MatchDataAccessService) {}

    resolve(): Observable<IListMatchesResolverData> {
        return this._matchDataAccess
            .listMatches({
                scheduledDate: null,
                status: null,
                limitBy: null,
                teamId: null
            })
            .pipe(
                map((dto) => ({ matches: dto.matches.map(MatchMapper.apiModelToDomain) })),
                catchError((error) => {
                    throw getRoutableException(error);
                }),
            );
    }
}

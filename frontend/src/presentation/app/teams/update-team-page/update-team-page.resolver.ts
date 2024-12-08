import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import PlayerMapper from '../../../mappers/PlayerMapper';
import Team from '../../../models/Team';
import TeamMapper from '../../../mappers/TeamMapper';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';

export interface IUpdateTeamResolverData {
    team: Team;
    id: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateTeamPageResolver implements Resolve<IUpdateTeamResolverData> {
    constructor(
        private _teamDataAccess: TeamDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IUpdateTeamResolverData> {
        const id = route.paramMap.get('id')

        if (id == null) {
            throw new Error('implement a 404');
        }

        return this._teamDataAccess.read(id).pipe(
            map((response) => {
                return {
                    team: TeamMapper.apiModelToDomain(response.team),
                    id: id
                }
            })
        );
    }
}

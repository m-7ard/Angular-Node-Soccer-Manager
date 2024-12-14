import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import TeamMapper from '../../../mappers/TeamMapper';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import TeamPlayer from '../../../models/TeamPlayer';
import TeamPlayerMapper from '../../../mappers/TeamPlayerMapper';
import NotFoundException from '../../../exceptions/NotFoundException';

export interface IReadTeamResolverData {
    team: Team;
    teamPlayers: TeamPlayer[];
}

@Injectable({ providedIn: 'root' })
export class ReadTeamPageResolver implements Resolve<IReadTeamResolverData> {
    constructor(private _teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IReadTeamResolverData> {
        const teamId = route.paramMap.get('teamId');

        console.log(teamId ?? 'null');

        if (teamId == null) {
            throw new NotFoundException('Read Tea Page: Team Id is null');
        }

        return this._teamDataAccess.readTeam(teamId).pipe(
            map((response) => {
                return {
                    team: TeamMapper.apiModelToDomain(response.team),
                    teamPlayers: response.teamPlayers.map(TeamPlayerMapper.apiModelToDomain),
                };
            }),
        );
    }
}

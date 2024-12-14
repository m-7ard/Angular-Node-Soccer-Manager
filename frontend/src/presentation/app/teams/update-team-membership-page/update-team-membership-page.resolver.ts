import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import TeamMapper from '../../../mappers/TeamMapper';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import TeamPlayer from '../../../models/TeamPlayer';
import TeamPlayerMapper from '../../../mappers/TeamPlayerMapper';

export interface IUpdateTeamMembershipResolverData {
    team: Team;
    teamPlayer: TeamPlayer;
}

@Injectable({ providedIn: 'root' })
export class UpdateTeamMembershipPageResolver implements Resolve<IUpdateTeamMembershipResolverData> {
    constructor(private _teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IUpdateTeamMembershipResolverData> {
        const teamId = route.parent!.paramMap.get('teamId');

        if (teamId == null) {
            throw new Error('implement a 404');
        }

        const playerId = route.paramMap.get('playerId');

        if (playerId == null) {
            throw new Error('implement a 404');
        }

        return this._teamDataAccess.readTeamPlayer(teamId, playerId).pipe(
            map((response) => {
                return {
                    team: TeamMapper.apiModelToDomain(response.team),
                    teamPlayer: TeamPlayerMapper.apiModelToDomain(response.teamPlayer),
                };
            }),
        );
    }
}

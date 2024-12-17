import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import TeamMapper from '../../../mappers/TeamMapper';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import TeamPlayer from '../../../models/TeamPlayer';
import TeamPlayerMapper from '../../../mappers/TeamPlayerMapper';
import getRoutableException from '../../../utils/getRoutableException';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';

export interface IUpdateTeamMembershipResolverData {
    team: Team;
    teamPlayer: TeamPlayer;
}

@Injectable({ providedIn: 'root' })
export class UpdateTeamMembershipPageResolver implements Resolve<IUpdateTeamMembershipResolverData> {
    constructor(private _teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IUpdateTeamMembershipResolverData> {
        let teamId = route.parent!.paramMap.get('teamId');

        if (teamId == null) {
            throw new ClientSideErrorException('Update Team Page: teamId param is null.');
        }

        const playerId = route.paramMap.get('playerId');
        if (playerId == null) {
            throw new ClientSideErrorException('Update Team Page: playerId param is null.');
        }

        return this._teamDataAccess.readTeamPlayer(teamId, playerId).pipe(
            map((response) => ({
                team: TeamMapper.apiModelToDomain(response.team),
                teamPlayer: TeamPlayerMapper.apiModelToDomain(response.teamPlayer),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}

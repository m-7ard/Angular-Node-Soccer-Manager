import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import TeamMapper from '../../../mappers/TeamMapper';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import TeamPlayer from '../../../models/TeamPlayer';
import TeamPlayerMapper from '../../../mappers/TeamPlayerMapper';
import NotFoundException from '../../../exceptions/NotFoundException';
import getRoutableException from '../../../utils/getRoutableException';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';

export interface IReadTeamResolverData {
    team: Team;
    teamPlayers: TeamPlayer[];
}

@Injectable({ providedIn: 'root' })
export class ReadTeamPageResolver implements Resolve<IReadTeamResolverData> {
    constructor(private _teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IReadTeamResolverData> {
        const teamId = route.paramMap.get('teamId');

        if (teamId == null) {
            throw new ClientSideErrorException('Read Team Page: teamId parameter is null.');
        }

        return this._teamDataAccess.readTeam(teamId).pipe(
            map((response) => ({
                team: TeamMapper.apiModelToDomain(response.team),
                teamPlayers: response.teamPlayers.map(TeamPlayerMapper.apiModelToDomain),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}

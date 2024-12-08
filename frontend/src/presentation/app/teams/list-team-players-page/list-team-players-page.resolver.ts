import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import TeamPlayer from '../../../models/TeamPlayer';
import TeamMembershipMapper from '../../../mappers/MembershipMapper';
import TeamMapper from '../../../mappers/TeamMapper';
import PlayerMapper from '../../../mappers/PlayerMapper';

export interface IListTeamPlayersResolverData {
    team: Team;
    teamPlayers: TeamPlayer[];
}

@Injectable({ providedIn: 'root' })
export class ListTeamPlayersPageResolver implements Resolve<{ team: Team; teamPlayers: TeamPlayer[] }> {
    constructor(
        private _teamDataAccess: TeamDataAccessService,
    ) {}


    resolve(route: ActivatedRouteSnapshot): Observable<{ team: Team; teamPlayers: TeamPlayer[] }> {
        const id = route.paramMap.get('id')

        if (id == null) {
            throw new Error('implement a 404');
        }

        return this._teamDataAccess.listTeamPlayers(id).pipe(
            map((dto) => {
                const { team, teamPlayers } = dto;
                
                return {
                    team: TeamMapper.apiModelToDomain(team),
                    teamPlayers: teamPlayers.map(({ player, membership }) => {
                        return new TeamPlayer({
                            player: PlayerMapper.apiModelToDomain(player),
                            membership: TeamMembershipMapper.apiModelToDomain(membership),
                        });
                    }),
                };
            }),
        );
    }
}

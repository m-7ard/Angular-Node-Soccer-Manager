import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import Player from '../../models/Player';
import Team from '../../models/Team';
import { PlayerDataAccessService } from '../../services/data-access/player-data-access.service';
import PlayerMapper from '../../mappers/PlayerMapper';
import { TeamDataAccessService } from '../../services/data-access/team-data-access.service';
import TeamMapper from '../../mappers/TeamMapper';

export interface IFrontpageResolverData {
    players: Player[];
    teams: Team[];
}

@Injectable({ providedIn: 'root' })
export class FrontpageResolver implements Resolve<IFrontpageResolverData> {
    constructor(
        private readonly _playerDataAccess: PlayerDataAccessService,
        private readonly _teamDataAccess: TeamDataAccessService,
    ) {}

    resolve(): Observable<IFrontpageResolverData> {
        const playersRequest = this._playerDataAccess.listPlayers({ name: null, limitBy: null }).pipe(
            map((response) => {
                return response.players.map(PlayerMapper.apiModelToDomain);
            }),
        );
        const teamsRequest = this._teamDataAccess
            .listTeams({ name: null, limitBy: 5, teamMembershipPlayerId: null })
            .pipe(
                map((response) => {
                    return response.teams.map(TeamMapper.apiModelToDomain);
                }),
            );
        
        return forkJoin({
            players: playersRequest,
            teams: teamsRequest
        })
    }
}

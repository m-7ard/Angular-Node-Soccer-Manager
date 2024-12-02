import { Injectable } from '@angular/core';
import ICreateTeamRequestDTO from '../../contracts/teams/create/ICreateTeamRequestDTO';
import { HttpClient } from '@angular/common/http';
import ICreateTeamMembershipRequestDTO from '../../contracts/teamMemberships/create/ICreateTeamMembershipRequestDTO';
import ICreateTeamMembershipResponseDTO from '../../contracts/teamMemberships/create/ICreateTeamMembershipResponseDTO';
import IListTeamsResponseDTO from '../../contracts/teams/list/IListTeamsResponseDTO';
import IListTeamPlayersResponseDTO from '../../contracts/teams/list-team-players/IListTeamPlayersResponseDTO';

@Injectable({
    providedIn: 'root',
})
export class TeamDataAccessService {
    private readonly _baseUrl = `http://127.0.0.1:3000/api/teams`;
    constructor(private http: HttpClient) {}

    createTeam(request: ICreateTeamRequestDTO) {
        return this.http.post<ICreateTeamRequestDTO>(`${this._baseUrl}/create`, request);
    }

    createTeamMembership(id: string, request: ICreateTeamMembershipRequestDTO) {
        return this.http.post<ICreateTeamMembershipResponseDTO>(`${this._baseUrl}/${id}/create-membership`, request);
    }

    addPlayer(teamId: string, request: ICreateTeamMembershipRequestDTO) {
        return this.http.post<{}>(`${this._baseUrl}/${teamId}}`, request);
    }

    listTeams() {
        return this.http.get<IListTeamsResponseDTO>(`${this._baseUrl}/`);
    }

    listTeamPlayers(teamId: string) {
        return this.http.get<IListTeamPlayersResponseDTO>(`${this._baseUrl}/${teamId}/players`);
    }
}

import { Injectable } from '@angular/core';
import ICreateTeamRequestDTO from '../../contracts/teams/create/ICreateTeamRequestDTO';
import { HttpClient } from '@angular/common/http';
import ICreateTeamMembershipRequestDTO from '../../contracts/teamMemberships/create/ICreateTeamMembershipRequestDTO';
import ICreateTeamMembershipResponseDTO from '../../contracts/teamMemberships/create/ICreateTeamMembershipResponseDTO';
import IListTeamsResponseDTO from '../../contracts/teams/list/IListTeamsResponseDTO';
import IListTeamPlayersResponseDTO from '../../contracts/teams/list-team-players/IListTeamPlayersResponseDTO';
import IDeleteTeamMembershipRequestDTO from '../../contracts/teamMemberships/delete/IDeleteTeamMembershipRequestDTO';
import IDeleteTeamMembershipResponseDTO from '../../contracts/teamMemberships/delete/IDeleteTeamMembershipResponseDTO';
import IReadTeamResponseDTO from '../../contracts/teams/read/IReadTeamResponseDTO';
import IUpdateTeamRequestDTO from '../../contracts/teams/update/IUpdateTeamRequestDTO';
import IDeleteTeamRequestDTO from '../../contracts/teams/delete/IDeleteTeamRequestDTO';
import IDeleteTeamResponseDTO from '../../contracts/teams/delete/IDeleteTeamResponseDTO';
import IReadTeamPlayerResponseDTO from '../../contracts/teams/read-team-player/IReadTeamPlayerResponseDTO';
import IUpdateTeamMembershipRequestDTO from '../../contracts/teamMemberships/update/IUpdateTeamMembershipRequestDTO';

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

    removePlayer(teamId: string, playerId: string, request: IDeleteTeamMembershipRequestDTO) {
        return this.http.delete<IDeleteTeamMembershipResponseDTO>(`${this._baseUrl}/${teamId}/delete-membership/${playerId}`, request);
    }

    listTeams() {
        return this.http.get<IListTeamsResponseDTO>(`${this._baseUrl}/`);
    }

    listTeamPlayers(teamId: string) {
        return this.http.get<IListTeamPlayersResponseDTO>(`${this._baseUrl}/${teamId}/players`);
    }

    readTeam(teamId: string) {
        return this.http.get<IReadTeamResponseDTO>(`${this._baseUrl}/${teamId}`);
    }

    readTeamPlayer(teamId: string, playerId: string) {
        return this.http.get<IReadTeamPlayerResponseDTO>(`${this._baseUrl}/${teamId}/players/${playerId}`);
    }

    updateTeam(teamId: string, request: IUpdateTeamRequestDTO) {
        return this.http.put<IReadTeamResponseDTO>(`${this._baseUrl}/${teamId}/update`, request);
    }

    updateTeamMembership(teamId: string, playerId: string, request: IUpdateTeamMembershipRequestDTO) {
        return this.http.put<IReadTeamResponseDTO>(`${this._baseUrl}/${teamId}/players/${playerId}/update`, request);
    }

    delete(teamId: string) {
        return this.http.delete<IDeleteTeamResponseDTO>(`${this._baseUrl}/${teamId}/delete`);
    }
}

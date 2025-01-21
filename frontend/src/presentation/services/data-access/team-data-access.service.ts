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
import IDeleteTeamResponseDTO from '../../contracts/teams/delete/IDeleteTeamResponseDTO';
import IReadTeamPlayerResponseDTO from '../../contracts/teams/read-team-player/IReadTeamPlayerResponseDTO';
import IUpdateTeamMembershipRequestDTO from '../../contracts/teamMemberships/update/IUpdateTeamMembershipRequestDTO';
import IListTeamsRequestDTO from '../../contracts/teams/list/IListTeamsRequestDTO';
import IListTeamMembershipHistoriesRequestDTO from '../../contracts/teamMemberships/list-histories/IListTeamMembershipHistoriesRequestDTO';
import IListTeamMembershipHistoriesResponseDTO from '../../contracts/teamMemberships/list-histories/IListTeamMembershipHistoriesResponseDTO';
import IUpdateTeamMembershipHistoryRequestDTO from '../../contracts/teamMembershipHistories/update/IUpdateTeamMembershipHistoryRequestDTO';
import IUpdateTeamMembershipHistoryResponseDTO from '../../contracts/teamMembershipHistories/update/IUpdateTeamMembershipHistoryResponseDTO';

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
        return this.http.delete<IDeleteTeamMembershipResponseDTO>(
            `${this._baseUrl}/${teamId}/delete-membership/${playerId}`,
            request,
        );
    }

    listTeams(request: IListTeamsRequestDTO) {
        const url = new URL(`${this._baseUrl}/`);
        Object.entries(request).forEach(([key, val]) => {
            if (val == null) {
                return;
            }

            url.searchParams.append(key, val);
        });

        return this.http.get<IListTeamsResponseDTO>(url.toString());
    }

    readTeam(teamId: string) {
        return this.http.get<IReadTeamResponseDTO>(`${this._baseUrl}/${teamId}`);
    }

    readTeamPlayer(teamId: string, membershipId: string) {
        return this.http.get<IReadTeamPlayerResponseDTO>(`${this._baseUrl}/${teamId}/memberships/${membershipId}`);
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

    listTeamMembershipHistories(
        teamId: string,
        teamMembershipId: string,
        request: IListTeamMembershipHistoriesRequestDTO,
    ) {
        const url = new URL(`${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories`);
        Object.entries(request).forEach(([key, val]) => {
            if (val == null) {
                return;
            }

            url.searchParams.append(key, val);
        });

        return this.http.get<IListTeamMembershipHistoriesResponseDTO>(url.toString());
    }

    updateTeamMembershipHistory(
        teamId: string,
        teamMembershipId: string,
        teamMembershipHistoryId: string,
        request: IUpdateTeamMembershipHistoryRequestDTO,
    ) {
        return this.http.put<IUpdateTeamMembershipHistoryResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories/${teamMembershipHistoryId}/update`,
            request,
        );
    }
}

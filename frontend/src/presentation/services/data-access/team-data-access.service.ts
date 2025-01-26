import { Injectable } from '@angular/core';
import ICreateTeamRequestDTO from '../../contracts/teams/create/ICreateTeamRequestDTO';
import { HttpClient } from '@angular/common/http';
import ICreateTeamMembershipRequestDTO from '../../contracts/teamMemberships/create/ICreateTeamMembershipRequestDTO';
import ICreateTeamMembershipResponseDTO from '../../contracts/teamMemberships/create/ICreateTeamMembershipResponseDTO';
import IListTeamsResponseDTO from '../../contracts/teams/list/IListTeamsResponseDTO';
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
import ICreateTeamMembershipHistoryRequestDTO from '../../contracts/teamMembershipHistories/create/ICreateTeamMembershipHistoryRequestDTO';
import ICreateTeamMembershipHistoryResponseDTO from '../../contracts/teamMembershipHistories/create/ICreateTeamMembershipHistoryResponseDTO';
import IUpdateTeamResponseDTO from '../../contracts/teams/update/IUpdateTeamResponseDTO';
import IDeleteTeamMembershipHistoryRequestDTO from '../../contracts/teamMembershipHistories/delete/IDeleteTeamMembershipHistoryRequestDTO';
import IDeleteTeamMembershipHistoryResponseDTO from '../../contracts/teamMembershipHistories/delete/IDeleteTeamMembershipHistoryResponseDTO';
import IDeleteTeamRequestDTO from '../../contracts/teams/delete/IDeleteTeamRequestDTO';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TeamDataAccessService {
    private readonly _baseUrl = `${environment.apiUrl}/api/teams`;
    constructor(private http: HttpClient) {}

    createTeam(request: ICreateTeamRequestDTO) {
        return this.http.post<ICreateTeamRequestDTO>(`${this._baseUrl}/create`, request);
    }

    createTeamMembership(id: string, request: ICreateTeamMembershipRequestDTO) {
        return this.http.post<ICreateTeamMembershipResponseDTO>(`${this._baseUrl}/${id}/create-membership`, request);
    }

    deleteTeamMembership(teamId: string, teamMembershipId: string, request: IDeleteTeamMembershipRequestDTO) {
        return this.http.delete<IDeleteTeamMembershipResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/delete`,
            request,
        );
    }

    deleteTeamMembershipHistory(
        teamId: string,
        teamMembershipId: string,
        teamMembershipHistoryId: string,
        request: IDeleteTeamMembershipHistoryRequestDTO,
    ) {
        return this.http.delete<IDeleteTeamMembershipHistoryResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories/${teamMembershipHistoryId}/delete`,
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
        return this.http.put<IUpdateTeamResponseDTO>(`${this._baseUrl}/${teamId}/update`, request);
    }

    updateTeamMembership(teamId: string, playerId: string, request: IUpdateTeamMembershipRequestDTO) {
        return this.http.put<IReadTeamResponseDTO>(`${this._baseUrl}/${teamId}/players/${playerId}/update`, request);
    }

    delete(teamId: string, request: IDeleteTeamRequestDTO) {
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

    createTeamMembershipHistory(
        teamId: string,
        teamMembershipId: string,
        request: ICreateTeamMembershipHistoryRequestDTO,
    ) {
        return this.http.post<ICreateTeamMembershipHistoryResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories/create`,
            request,
        );
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

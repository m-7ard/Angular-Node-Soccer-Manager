import { Injectable } from '@angular/core';
import Team from '../../models/Team';
import { Observable, of } from 'rxjs';
import ICreateTeamRequestDTO from '../../contracts/teams/create/ICreateTeamRequestDTO';
import { HttpClient, HttpResponse } from '@angular/common/http';
import ICompactTeamApiModel from '../../app/apiModels/ICompactTeamApiModel';
import IListTeamsResponseDTO from '../../contracts/teams copy/list/IListTeamsResponseDTO';

@Injectable({
    providedIn: 'root',
})
export class TeamDataAccessService {
    private readonly _baseUrl = `http://127.0.0.1:3000/api/teams`;
    constructor(private http: HttpClient) {}

    createTeam(data: ICreateTeamRequestDTO) {
        return this.http.post<{ id: string; }>(`${this._baseUrl}/create`, data);
    }

    listTeams() {
        return this.http.get<IListTeamsResponseDTO>(`${this._baseUrl}/`);
    }
}

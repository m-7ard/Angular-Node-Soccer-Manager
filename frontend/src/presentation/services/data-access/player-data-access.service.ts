import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import IListPlayersResponseDTO from '../../contracts/players/list/IListPlayersResponseDTO';
import ICreatePlayerRequestDTO from '../../contracts/players/create/ICreatePlayerRequestDTO';

@Injectable({
    providedIn: 'root',
})
export class PlayerDataAccessService {
    private readonly _baseUrl = `http://127.0.0.1:3000/api/players`;
    constructor(private http: HttpClient) {}

    listPlayers() {
        return this.http.get<IListPlayersResponseDTO>(`${this._baseUrl}/`);
    }

    createPlayer(request: ICreatePlayerRequestDTO) {
        return this.http.post<{ id: string; }>(`${this._baseUrl}/create`, request);
    }
}

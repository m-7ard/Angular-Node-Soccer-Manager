import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import IListPlayersResponseDTO from '../../contracts/players/list/IListPlayersResponseDTO';
import ICreatePlayerRequestDTO from '../../contracts/players/create/ICreatePlayerRequestDTO';
import IListPlayersRequestDTO from '../../contracts/players/list/IListPlayersRequestDTO';

@Injectable({
    providedIn: 'root',
})
export class PlayerDataAccessService {
    private readonly _baseUrl = `http://127.0.0.1:3000/api/players`;
    constructor(private http: HttpClient) {}

    listPlayers(request: IListPlayersRequestDTO) {
        const url = new URL(`${this._baseUrl}/`);
        Object.entries(request).forEach(([key, val]) => {
            url.searchParams.append(key, val);
        });

        return this.http.get<IListPlayersResponseDTO>(url.toString());
    }

    createPlayer(request: ICreatePlayerRequestDTO) {
        return this.http.post<{ id: string; }>(`${this._baseUrl}/create`, request);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import IListPlayersResponseDTO from '../../contracts/players/list/IListPlayersResponseDTO';
import ICreatePlayerRequestDTO from '../../contracts/players/create/ICreatePlayerRequestDTO';
import IListPlayersRequestDTO from '../../contracts/players/list/IListPlayersRequestDTO';
import IUpdatePlayerRequestDTO from '../../contracts/players/update/IUpdatePlayerRequestDTO';
import ICreatePlayerResponseDTO from '../../contracts/players/create/ICreatePlayerResponseDTO';
import IUpdatePlayerResponseDTO from '../../contracts/players/update/IUpdatePlayerResponseDTO';
import IDeletePlayerRequestDTO from '../../contracts/players/delete/IDeletePlayerRequestDTO';
import IDeletePlayerResponseDTO from '../../contracts/players/delete/IDeletePlayerResponseDTO';
import Player from '../../models/Player';
import IReadPlayerRequestDTO from '../../contracts/players/read/IReadPlayerRequestDTO';
import IReadPlayerResponseDTO from '../../contracts/players/read/IReadPlayerResponseDTO';
import IReadFullPlayerRequestDTO from '../../contracts/players/read-full/IReadPlayerRequestDTO';
import IReadFullPlayerResponseDTO from '../../contracts/players/read-full/IReadPlayerResponseDTO';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PlayerDataAccessService {
    private readonly _baseUrl = `${environment.apiUrl}/api/players`;
    constructor(private http: HttpClient) {}

    listPlayers(request: IListPlayersRequestDTO) {
        const url = new URL(`${this._baseUrl}/`);
        Object.entries(request).forEach(([key, val]) => {
            if (val == null) {
                return;
            }

            url.searchParams.append(key, val);
        });

        return this.http.get<IListPlayersResponseDTO>(url.toString());
    }

    createPlayer(request: ICreatePlayerRequestDTO) {
        return this.http.post<ICreatePlayerResponseDTO>(`${this._baseUrl}/create`, request);
    }

    update(playerId: Player['id'], request: IUpdatePlayerRequestDTO) {
        return this.http.put<IUpdatePlayerResponseDTO>(`${this._baseUrl}/${playerId}/update`, request);
    }

    read(playerId: Player['id'], request: IReadPlayerRequestDTO) {
        return this.http.get<IReadPlayerResponseDTO>(`${this._baseUrl}/${playerId}`, request);
    }

    readFull(playerId: Player['id'], request: IReadFullPlayerRequestDTO) {
        return this.http.get<IReadFullPlayerResponseDTO>(`${this._baseUrl}/${playerId}/full`, request);
    }

    delete(playerId: Player['id'], request: IDeletePlayerRequestDTO) {
        return this.http.delete<IDeletePlayerResponseDTO>(`${this._baseUrl}/${playerId}/delete`, request);
    }
}

import { HttpClient } from '@angular/common/http';
import IListMatchesRequestDTO from '../../contracts/matches/list/IListMatchesRequestDTO';
import IListMatchesResponseDTO from '../../contracts/matches/list/IListMatchesResponseDTO';
import { Injectable } from '@angular/core';
import IScheduleMatchRequestDTO from '../../contracts/matches/schedule/IScheduleMatchRequestDTO';
import IScheduleMatchResponseDTO from '../../contracts/matches/schedule/IScheduleMatchResponseDTO';
import IReadMatchRequestDTO from '../../contracts/matches/read/IReadMatchRequestDTO';
import IReadMatchResponseDTO from '../../contracts/matches/read/IReadMatchResponseDTO';

@Injectable({
    providedIn: 'root',
})
export class MatchDataAccessService {
    private readonly _baseUrl = `http://127.0.0.1:3000/api/matches`;
    constructor(private http: HttpClient) {}

    listMatches(request: IListMatchesRequestDTO) {
        const url = new URL(`${this._baseUrl}/`);
        Object.entries(request).forEach(([key, val]) => {
            if (val == null) {
                return;
            }

            url.searchParams.append(key, val);
        });

        return this.http.get<IListMatchesResponseDTO>(url.toString());
    }

    readMatch(request: IReadMatchRequestDTO) {
        return this.http.post<IReadMatchResponseDTO>(`${this._baseUrl}`, request);
    }

    scheduleMatch(request: IScheduleMatchRequestDTO) {
        return this.http.post<IScheduleMatchResponseDTO>(`${this._baseUrl}/schedule_match`, request);
    }
}

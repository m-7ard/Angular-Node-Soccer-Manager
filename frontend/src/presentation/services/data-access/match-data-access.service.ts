import { HttpClient } from '@angular/common/http';
import IListMatchesRequestDTO from '../../contracts/matches/list/IListMatchesRequestDTO';
import IListMatchesResponseDTO from '../../contracts/matches/list/IListMatchesResponseDTO';
import { Injectable } from '@angular/core';
import IScheduleMatchRequestDTO from '../../contracts/matches/schedule/IScheduleMatchRequestDTO';
import IScheduleMatchResponseDTO from '../../contracts/matches/schedule/IScheduleMatchResponseDTO';
import IReadMatchRequestDTO from '../../contracts/matches/read/IReadMatchRequestDTO';
import IReadMatchResponseDTO from '../../contracts/matches/read/IReadMatchResponseDTO';
import IDeleteMatchRequestDTO from '../../contracts/matches/delete/IDeleteMatchRequestDTO';
import IDeleteMatchResponseDTO from '../../contracts/matches/delete/IDeleteMatchResponseDTO';
import IMarkMatchInProgressRequestDTO from '../../contracts/matches/markMatchInProgress/IMarkMatchInProgressRequestDTO';
import IMarkMatchInProgressResponseDTO from '../../contracts/matches/markMatchInProgress/IMarkMatchInProgressResponseDTO';
import IMarkMatchCompletedRequestDTO from '../../contracts/matches/markMatchCompleted/IMarkMatchCompletedRequestDTO';
import IMarkMatchCompletedResponseDTO from '../../contracts/matches/markMatchCompleted/IMarkMatchCompletedResponseDTO';
import IMarkMatchCancelledRequestDTO from '../../contracts/matches/markMatchCancelled/IMarkMatchCancelledRequestDTO';
import IMarkMatchCancelledResponseDTO from '../../contracts/matches/markMatchCancelled/IMarkMatchCancelledResponseDTO';
import IRecordGoalRequestDTO from '../../contracts/matchEvents/recordGoal/IRecordGoalRequestDTO';
import IRecordGoalResponseDTO from '../../contracts/matchEvents/recordGoal/IRecordGoalResponseDTO';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MatchDataAccessService {
    private readonly _baseUrl = `${environment}/api/matches`;
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

    readMatch(matchId: string, request: IReadMatchRequestDTO) {
        return this.http.get<IReadMatchResponseDTO>(`${this._baseUrl}/${matchId}`, request);
    }

    scheduleMatch(request: IScheduleMatchRequestDTO) {
        return this.http.post<IScheduleMatchResponseDTO>(`${this._baseUrl}/schedule`, request);
    }

    recordGoal(matchId: string, request: IRecordGoalRequestDTO) {
        return this.http.post<IRecordGoalResponseDTO>(`${this._baseUrl}/${matchId}/record_goal`, request);
    }

    markInProgress(matchId: string, request: IMarkMatchInProgressRequestDTO) {
        return this.http.post<IMarkMatchInProgressResponseDTO>(`${this._baseUrl}/${matchId}/mark_in_progress`, request);
    }

    markCompleted(matchId: string, request: IMarkMatchCompletedRequestDTO) {
        return this.http.post<IMarkMatchCompletedResponseDTO>(`${this._baseUrl}/${matchId}/mark_completed`, request);
    }

    markCancelled(matchId: string, request: IMarkMatchCancelledRequestDTO) {
        return this.http.post<IMarkMatchCancelledResponseDTO>(`${this._baseUrl}/${matchId}/mark_cancelled`, request);
    }

    delete(matchId: string, request: IDeleteMatchRequestDTO) {
        return this.http.delete<IDeleteMatchResponseDTO>(`${this._baseUrl}/${matchId}/delete`, request);
    }
}

import { Injectable } from '@angular/core';
import MatchStatus from '../app/values/MatchStatus';

@Injectable({
    providedIn: 'root',
})
export class MatchStatusSingleton {
    readonly MatchStatusCls: typeof MatchStatus = MatchStatus;
}

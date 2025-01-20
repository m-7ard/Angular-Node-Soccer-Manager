import { Injectable } from '@angular/core';
import MatchStatus from '../values/MatchStatus';

@Injectable({
    providedIn: 'root',
})
export class MatchStatusSingleton {
    readonly MatchStatusCls: typeof MatchStatus = MatchStatus;
}

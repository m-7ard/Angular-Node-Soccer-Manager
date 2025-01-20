import { Injectable } from '@angular/core';
import PlayerPosition from '../values/PlayerPosition';
import convertToTitleCase from '../utils/convertToTitleCase';

@Injectable({
    providedIn: 'root',
})
export class PlayerPositionSingleton {
    readonly options = PlayerPosition.validPositions.map((position) => ({ value: position.value, label: convertToTitleCase(position.value) }))
    readonly PlayerPositionCls = PlayerPosition;
}

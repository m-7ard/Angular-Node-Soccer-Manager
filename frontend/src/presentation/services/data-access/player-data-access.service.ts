import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Player from '../../models/Player';
import ICreatePlayerRequestDTO from '../../contracts/players/create/ICreatePlayerRequestDTO';

const createPlayer = (seed: number) => {
    return new Player({
        id: crypto.randomUUID(),
        name: `player_${seed}`,
        number: seed,
        team: {
            id: crypto.randomUUID(),
            name: `team_${crypto.randomUUID()}`,
            dateFounded: new Date(),
        }

    });
};

@Injectable({
    providedIn: 'root',
})
export class PlayerDataAccessService {
    private _players: Player[] = [createPlayer(1), createPlayer(2), createPlayer(3), createPlayer(4), createPlayer(5)];

    constructor() {}

    listPlayers(): Observable<Player[]> {
        return of(this._players);
    }

    createPlayer(request: ICreatePlayerRequestDTO): Observable<string> {
        const player = new Player({
            id: crypto.randomUUID(),
            name: request.name,
            number: request.number,
            team: {
                id: request.teamId,
                name: `team_${crypto.randomUUID()}`,
                dateFounded: new Date(),
            },
        });

        this._players.push(player);

        return of(player.id);
    }
}

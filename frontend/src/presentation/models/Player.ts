interface PlayerTeamValue {
    id: string;
    name: string;
    dateFounded: Date;
}

class Player {
    constructor({
        id,
        name,
        number,
        team,
    }: {
        id: string;
        name: string;
        number: number;
        team: PlayerTeamValue;
    }) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.team = team;
    }

    public id: string;
    public name: string;
    public number: number;
    public team: PlayerTeamValue;
}

export default Player;

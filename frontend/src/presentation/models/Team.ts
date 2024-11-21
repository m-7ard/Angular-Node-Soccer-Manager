interface TeamPlayerValue {
    id: string;
    name: string;
    number: number;
}

class Team {
    constructor({
        id,
        name,
        dateFounded,
        players,
    }: {
        id: string;
        name: string;
        dateFounded: Date;
        players: TeamPlayerValue[];
    }) {
        this.id = id;
        this.name = name;
        this.dateFounded = dateFounded;
        this.players = players;
    }

    public id: string;
    public name: string;
    public dateFounded: Date;
    public players: TeamPlayerValue[];
}

export default Team;

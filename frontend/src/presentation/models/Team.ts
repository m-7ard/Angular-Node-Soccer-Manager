class Team {
    constructor({
        id,
        name,
        dateFounded,
    }: {
        id: string;
        name: string;
        dateFounded: Date;
    }) {
        this.id = id;
        this.name = name;
        this.dateFounded = dateFounded;
    }

    public id: string;
    public name: string;
    public dateFounded: Date;
}

export default Team;

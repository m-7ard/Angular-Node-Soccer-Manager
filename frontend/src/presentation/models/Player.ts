class Player {
    constructor({
        id,
        name,
    }: {
        id: string;
        name: string;
    }) {
        this.id = id;
        this.name = name;
    }

    public id: string;
    public name: string;
}

export default Player;

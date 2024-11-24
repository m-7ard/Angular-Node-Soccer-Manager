class Player {
    constructor({
        id,
        name,
        number,
    }: {
        id: string;
        name: string;
        number: number;
    }) {
        this.id = id;
        this.name = name;
        this.number = number;
    }

    public id: string;
    public name: string;
    public number: number;
}

export default Player;

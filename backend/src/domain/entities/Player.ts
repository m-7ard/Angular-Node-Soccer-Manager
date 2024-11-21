class Player {
    private readonly __type: "PLAYER_DOMAIN" = null!;

    constructor({ id, name, activeSince, number }: { id: string; name: string; activeSince: Date; number: number }) {
        this.id = id;
        this.name = name;
        this.activeSince = activeSince;
        this.number = number;
    }

    public id: string;
    public name: string;
    public activeSince: Date;
    public number: number;
}

export default Player;

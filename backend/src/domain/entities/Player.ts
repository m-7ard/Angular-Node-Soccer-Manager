class Player {
    private readonly __type: "PLAYER_DOMAIN" = null!;

    constructor({ id, name, activeSince }: { id: string; name: string; activeSince: Date; }) {
        this.id = id;
        this.name = name;
        this.activeSince = activeSince;
    }

    public id: string;
    public name: string;
    public activeSince: Date;
}

export default Player;

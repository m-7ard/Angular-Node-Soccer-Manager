import PlayerId from "domain/valueObjects/Player/PlayerId";

interface Props {
    id: PlayerId;
    name: string;
    activeSince: Date;
}

class Player implements Props {
    private readonly __type: "PLAYER_DOMAIN" = null!;

    constructor({ id, name, activeSince }: Props) {
        this.id = id;
        this.name = name;
        this.activeSince = activeSince;
    }

    public id: PlayerId;
    public name: string;
    public activeSince: Date;
}

export default Player;

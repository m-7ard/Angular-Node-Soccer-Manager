import PlayerId from "domain/valueObjects/Player/PlayerId";
import Player from "../entities/Player";

class PlayerFactory {
    static CreateNew({ id, name, activeSince }: { id: PlayerId; name: string; activeSince: Date }) {
        return new Player({
            id: id,
            name: name,
            activeSince: activeSince,
        });
    }

    static CreateExisting({ id, name, activeSince }: { id: PlayerId; name: string; activeSince: Date }) {
        return new Player({
            id: id,
            name: name,
            activeSince: activeSince,
        });
    }
}

export default PlayerFactory;

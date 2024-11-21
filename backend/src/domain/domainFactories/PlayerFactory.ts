import Player from "../entities/Player";

class PlayerFactory {
    static CreateNew({
        id,
        name,
        activeSince,
        number,
    }: {
        id: string;
        name: string;
        activeSince: Date;
        number: number;
    }) {
        return new Player({
            id: id,
            name: name,
            activeSince: activeSince,
            number: number,
        });
    }

    static CreateExisting({
        id,
        name,
        activeSince,
        number,
    }: {
        id: string;
        name: string;
        activeSince: Date;
        number: number;
    }) {
        return new Player({
            id: id,
            name: name,
            activeSince: activeSince,
            number: number,
        });
    }
}

export default PlayerFactory;

import Player from "domain/entities/Player";

interface IPlayerRepository {
    createAsync(player: Player): Promise<Player>;
    updateAsync(player: Player): Promise<Player>;
    deleteAsync(player: Player): Promise<void>;
    getByIdAsync(id: string): Promise<Player | null>;
    findAllAsync(criteria: {
        name: string | null;
    }): Promise<Player[]>;
}

export default IPlayerRepository;

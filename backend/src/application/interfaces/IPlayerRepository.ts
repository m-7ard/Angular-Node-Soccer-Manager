import Player from "domain/entities/Player";

interface IPlayerRepository {
    createAsync(player: Player): Promise<Player>;
    updateAsync(player: Player): Promise<Player>;
    getByIdAsync(id: string): Promise<Player | null>;
}

export default IPlayerRepository;

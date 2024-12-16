import Player from "domain/entities/Player";
import FilterAllPlayersCriteria from "infrastructure/contracts/FilterAllPlayersCriteria";

interface IPlayerRepository {
    createAsync(player: Player): Promise<Player>;
    updateAsync(player: Player): Promise<Player>;
    deleteAsync(player: Player): Promise<void>;
    getByIdAsync(id: string): Promise<Player | null>;
    findAllAsync(criteria: FilterAllPlayersCriteria): Promise<Player[]>;
}

export default IPlayerRepository;

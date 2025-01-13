import Player from "domain/entities/Player";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import FilterAllPlayersCriteria from "infrastructure/contracts/FilterAllPlayersCriteria";

interface IPlayerRepository {
    createAsync(player: Player): Promise<Player>;
    updateAsync(player: Player): Promise<Player>;
    deleteAsync(player: Player): Promise<void>;
    getByIdAsync(id: PlayerId): Promise<Player | null>;
    findAllAsync(criteria: FilterAllPlayersCriteria): Promise<Player[]>;
}

export default IPlayerRepository;

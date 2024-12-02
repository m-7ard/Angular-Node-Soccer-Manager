import IPlayerApiModel from '../apiModels/IPlayerApiModel';
import Player from '../models/Player';

class PlayerMapper {
    static apiModelToDomain(source: IPlayerApiModel) {
        return new Player({
            id: source.id,
            name: source.name,
            activeSince: new Date(source.activeSince)
        });
    }
}

export default PlayerMapper;
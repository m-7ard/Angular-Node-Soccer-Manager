import IPlayerApiModel from '../apiModels/IPlayerApiModel';
import Player from '../models/Player';

class PlayerMapper {
    static apiModelToDomain(source: IPlayerApiModel) {
        return new Player({
            id: source.id,
            name: source.name,
            number: source.number,
        });
    }
}

export default PlayerMapper;
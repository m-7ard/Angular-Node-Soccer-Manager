import Player from "domain/entities/Player";
import PlayerDbEntity from "infrastructure/dbEntities/PlayerDbEntity";


class PlayerMapper {
    static domainToDbEntity(source: Player): PlayerDbEntity {
        return new PlayerDbEntity({
            id: source.id,
            name: source.name,
            active_since: source.activeSince,
            number: source.number
        })
    }

    static dbEntityToDomain(source: PlayerDbEntity): Player {
        return new Player({
            id: source.id,
            name: source.name,
            activeSince: source.active_since,
            number: source.number
        })
    }
}

export default PlayerMapper;
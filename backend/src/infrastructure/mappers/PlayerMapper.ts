import Player from "domain/entities/Player";
import PlayerDbEntity from "infrastructure/dbEntities/PlayerDbEntity";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";


class PlayerMapper {
    static schemaToDbEntity(source: IPlayerSchema): PlayerDbEntity {
        return new PlayerDbEntity({
            id: source.id,
            name: source.name,
            activeSince: source.activeSince,
            number: source.number
        });
    }

    static domainToDbEntity(source: Player): PlayerDbEntity {
        return new PlayerDbEntity({
            id: source.id,
            name: source.name,
            activeSince: source.activeSince,
            number: source.number
        })
    }

    static dbEntityToDomain(source: PlayerDbEntity): Player {
        return new Player({
            id: source.id,
            name: source.name,
            activeSince: source.activeSince,
            number: source.number
        })
    }
}

export default PlayerMapper;
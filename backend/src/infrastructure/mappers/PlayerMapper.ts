import Player from "domain/entities/Player";
import PlayerDbEntity from "infrastructure/dbEntities/PlayerDbEntity";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";


class PlayerMapper {
    static schemaToDbEntity(source: IPlayerSchema): PlayerDbEntity {
        return new PlayerDbEntity({
            id: source.id,
            name: source.name,
            active_since: source.active_since,
        });
    }

    static domainToDbEntity(source: Player): PlayerDbEntity {
        return new PlayerDbEntity({
            id: source.id,
            name: source.name,
            active_since: source.activeSince,
        })
    }

    static dbEntityToDomain(source: PlayerDbEntity): Player {
        return new Player({
            id: source.id,
            name: source.name,
            activeSince: source.active_since,
        })
    }
}

export default PlayerMapper;
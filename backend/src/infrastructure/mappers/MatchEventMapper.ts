import MatchEvent from "domain/entities/MatchEvent";
import MatchEventPosition from "domain/valueObjects/MatchEvent/MatchEventPosition";
import MatchEventType from "domain/valueObjects/MatchEvent/MatchEventType";
import MatchEventDbEntity from "infrastructure/dbEntities/MatchEventDbEntity";
import IMatchEventSchema from "infrastructure/dbSchemas/IMatchEventSchema";

class MatchEventMapper {
    static schemaToDbEntity(source: IMatchEventSchema): MatchEventDbEntity {
        return new MatchEventDbEntity({
            id: source.id,
            match_id: source.match_id,
            player_id: source.player_id,
            team_id: source.team_id,
            type: source.type,
            timestamp: source.timestamp,
            secondary_player_id: source.secondary_player_id,
            description: source.description,
            x_position: source.x_position,
            y_position: source.y_position,
            created_at: source.created_at,
            updated_at: source.updated_at,
   
        });
    }

    static domainToDbEntity(source: MatchEvent): MatchEventDbEntity {
        return new MatchEventDbEntity({
            id: source.id,
            match_id: source.matchId,
            player_id: source.playerId,
            team_id: source.teamId,
            type: source.type.value,
            timestamp: source.timestamp,
            secondary_player_id: source.secondaryPlayerId,
            description: source.description,
            x_position: source.position?.x ?? null,
            y_position: source.position?.y ?? null,
            created_at: source.createdAt,
            updated_at: source.updatedAt,
        });
    }

    static dbEntityToDomain(source: MatchEventDbEntity): MatchEvent {
        return new MatchEvent({
            id: source.id,
            matchId: source.match_id,
            playerId: source.match_id,
            teamId: source.team_id,
            type: MatchEventType.create(source.type),
            timestamp: source.timestamp,
            secondaryPlayerId: source.secondary_player_id,
            description: source.description,
            position: MatchEventPosition.createOrNull({ x: source.x_position, y: source.y_position }),
            createdAt: source.created_at,
            updatedAt: source.updated_at,
        });
    }
}

export default MatchEventMapper;

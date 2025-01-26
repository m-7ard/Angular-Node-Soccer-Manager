import MatchEvent from "domain/entities/MatchEvent";
import MatchEventType from "domain/valueObjects/MatchEvent/MatchEventType";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
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
            dateOccured: source.date_occured,
            secondary_player_id: source.secondary_player_id,
            description: source.description,
        });
    }

    static domainToDbEntity(source: MatchEvent): MatchEventDbEntity {
        return new MatchEventDbEntity({
            id: source.id,
            match_id: source.matchId,
            player_id: source.playerId.value,
            team_id: source.teamId.value,
            type: source.type.value,
            dateOccured: source.dateOccured,
            secondary_player_id: source.secondaryPlayerId == null ? null : source.secondaryPlayerId.value,
            description: source.description,
        });
    }

    static dbEntityToDomain(source: MatchEventDbEntity): MatchEvent {
        return new MatchEvent({
            id: source.id,
            matchId: source.match_id,
            playerId: PlayerId.executeCreate(source.player_id),
            teamId: TeamId.executeCreate(source.team_id),
            type: MatchEventType.create(source.type),
            dateOccured: source.date_occured,
            secondaryPlayerId: source.secondary_player_id == null ? null : PlayerId.executeCreate(source.secondary_player_id),
            description: source.description,
        });
    }
}

export default MatchEventMapper;

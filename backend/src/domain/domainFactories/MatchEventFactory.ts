import MatchEvent from "domain/entities/MatchEvent";

class MatchEventFactory {
    static CreateNew(props: {
        id: MatchEvent["id"];
        matchId: MatchEvent["matchId"];
        playerId: MatchEvent["playerId"];
        teamId: MatchEvent["teamId"];
        type: MatchEvent["type"];
        dateOccured: MatchEvent["dateOccured"];
        secondaryPlayerId: MatchEvent["secondaryPlayerId"];
        description: MatchEvent["description"];
    }) {
        return new MatchEvent({
            id: props.id,
            matchId: props.matchId,
            playerId: props.playerId,
            teamId: props.teamId,
            type: props.type,
            dateOccured: props.dateOccured,
            secondaryPlayerId: props.secondaryPlayerId,
            description: props.description,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static CreateExisting(props: {
        id: MatchEvent["id"];
        matchId: MatchEvent["matchId"];
        playerId: MatchEvent["playerId"];
        teamId: MatchEvent["teamId"];
        type: MatchEvent["type"];
        dateOccured: MatchEvent["dateOccured"];
        secondaryPlayerId: MatchEvent["secondaryPlayerId"];
        description: MatchEvent["description"];
        createdAt: MatchEvent["createdAt"];
        updatedAt: MatchEvent["updatedAt"];
    }) {
        return new MatchEvent({
            id: props.id,
            matchId: props.matchId,
            playerId: props.playerId,
            teamId: props.teamId,
            type: props.type,
            dateOccured: props.dateOccured,
            secondaryPlayerId: props.secondaryPlayerId,
            description: props.description,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }
}

export default MatchEventFactory;

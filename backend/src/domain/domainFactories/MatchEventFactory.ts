import MatchEvent from "domain/entities/MatchEvent";

class MatchEventFactory {
    static CreateNew(props: {
        id: MatchEvent["id"];
        matchId: MatchEvent["matchId"];
        playerId: MatchEvent["playerId"];
        teamId: MatchEvent["teamId"];
        type: MatchEvent["type"];
        timestamp: MatchEvent["timestamp"];
        secondaryPlayerId: MatchEvent["secondaryPlayerId"];
        description: MatchEvent["description"];
        position: MatchEvent["position"];
    }) {
        return new MatchEvent({
            id: props.id,
            matchId: props.matchId,
            playerId: props.playerId,
            teamId: props.teamId,
            type: props.type,
            timestamp: props.timestamp,
            secondaryPlayerId: props.secondaryPlayerId,
            description: props.description,
            position: props.position,
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
        timestamp: MatchEvent["timestamp"];
        secondaryPlayerId: MatchEvent["secondaryPlayerId"];
        description: MatchEvent["description"];
        position: MatchEvent["position"];
        createdAt: MatchEvent["createdAt"];
        updatedAt: MatchEvent["updatedAt"];
    }) {
        return new MatchEvent({
            id: props.id,
            matchId: props.matchId,
            playerId: props.playerId,
            teamId: props.teamId,
            type: props.type,
            timestamp: props.timestamp,
            secondaryPlayerId: props.secondaryPlayerId,
            description: props.description,
            position: props.position,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }
}

export default MatchEventFactory;

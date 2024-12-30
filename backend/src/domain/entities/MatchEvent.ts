import Team from "./Team";
import Match from "./Match";
import Player from "./Player";
import MatchEventType from "domain/valueObjects/MatchEvent/MatchEventType";
import MatchEventPosition from "domain/valueObjects/MatchEvent/MatchEventPosition";

type MatchEventProps = {
    id: string;
    matchId: Match["id"];
    playerId: Player["id"];
    teamId: Team["id"];
    type: MatchEventType;
    timestamp: Date;
    secondaryPlayerId: Player["id"] | null;
    description: string;
    position: MatchEventPosition | null;
    createdAt: Date;
    updatedAt: Date;
};

class MatchEvent {
    private readonly __type: "MATCH_EVENT_DOMAIN" = null!;

    public id: string;
    public matchId: Match["id"];
    public playerId: Player["id"];
    public teamId: Team["id"];
    public type: MatchEventType;
    public timestamp: Date;
    public secondaryPlayerId: Player["id"] | null;
    public description: string;
    public position: MatchEventPosition | null;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: MatchEventProps) {
        this.id = props.id;
        this.matchId = props.matchId;
        this.playerId = props.playerId;
        this.teamId = props.teamId;
        this.type = props.type;
        this.timestamp = props.timestamp;
        this.secondaryPlayerId = props.secondaryPlayerId;
        this.description = props.description;
        this.position = props.position;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}

export default MatchEvent;

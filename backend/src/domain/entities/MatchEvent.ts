import Match from "./Match";
import MatchEventType from "domain/valueObjects/MatchEvent/MatchEventType";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";

type MatchEventProps = {
    id: string;
    matchId: Match["id"];
    playerId: PlayerId;
    teamId: TeamId;
    type: MatchEventType;
    dateOccured: Date;
    secondaryPlayerId: PlayerId | null;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

class MatchEvent {
    private readonly __type: "MATCH_EVENT_DOMAIN" = null!;

    public id: string;
    public matchId: Match["id"];
    public playerId: PlayerId;
    public teamId: TeamId;
    public type: MatchEventType;
    public dateOccured: Date;
    public secondaryPlayerId: PlayerId | null;
    public description: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: MatchEventProps) {
        this.id = props.id;
        this.matchId = props.matchId;
        this.playerId = props.playerId;
        this.teamId = props.teamId;
        this.type = props.type;
        this.dateOccured = props.dateOccured;
        this.secondaryPlayerId = props.secondaryPlayerId;
        this.description = props.description;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}

export default MatchEvent;

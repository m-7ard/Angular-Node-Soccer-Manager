import IMatchEventSchema from "infrastructure/dbSchemas/IMatchEventSchema";
import PlayerDbEntity from "./PlayerDbEntity";
import TeamDbEntity from "./TeamDbEntity";

class MatchEventDbEntity implements IMatchEventSchema {
    id: string;
    match_id: string;
    player_id: string;
    team_id: string;
    type: string;
    timestamp: Date;
    secondary_player_id: string | null;
    description: string;
    x_position: number | null;
    y_position: number | null;
    created_at: Date;
    updated_at: Date;

    match: MatchEventDbEntity = null!;
    player: PlayerDbEntity = null!;
    team: TeamDbEntity = null!;
    secondary_player: PlayerDbEntity | null = null;

    constructor(props: {
        id: string;
        match_id: string;
        player_id: string;
        team_id: string;
        type: string;
        timestamp: Date;
        secondary_player_id: string | null;
        description: string;
        x_position: number | null;
        y_position: number | null;
        created_at: Date;
        updated_at: Date;
    }) {
        this.id = props.id;
        this.match_id = props.match_id;
        this.player_id = props.player_id;
        this.team_id = props.team_id;
        this.type = props.type;
        this.timestamp = props.timestamp;
        this.secondary_player_id = props.secondary_player_id;
        this.description = props.description;
        this.x_position = props.x_position;
        this.y_position = props.y_position;
        this.created_at = props.created_at;
        this.updated_at = props.updated_at;
    }
}

export default MatchEventDbEntity;

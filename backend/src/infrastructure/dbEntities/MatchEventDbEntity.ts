import IMatchEventSchema from "infrastructure/dbSchemas/IMatchEventSchema";
import PlayerDbEntity from "./PlayerDbEntity";
import TeamDbEntity from "./TeamDbEntity";
import sql from "sql-template-tag";

class MatchEventDbEntity implements IMatchEventSchema {
    id: string;
    match_id: string;
    player_id: string;
    team_id: string;
    type: string;
    date_occured: Date;
    secondary_player_id: string | null;
    description: string;
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
        dateOccured: Date;
        secondary_player_id: string | null;
        description: string;
        created_at: Date;
        updated_at: Date;
    }) {
        this.id = props.id;
        this.match_id = props.match_id;
        this.player_id = props.player_id;
        this.team_id = props.team_id;
        this.type = props.type;
        this.date_occured = props.dateOccured;
        this.secondary_player_id = props.secondary_player_id;
        this.description = props.description;
        this.created_at = props.created_at;
        this.updated_at = props.updated_at;
    }

    public getInsertStatement() {
        return sql`
            INSERT INTO match_events
                SET
                    id = ${this.id},
                    match_id = ${this.match_id},
                    player_id = ${this.player_id},
                    team_id = ${this.team_id},
                    type = ${this.type},
                    date_occured = ${this.date_occured},
                    secondary_player_id = ${this.secondary_player_id},
                    description = ${this.description}
        `;
    }

    public getDeleteStatement() {
        return sql`
            DELETE FROM match_events WHERE
                id = ${this.id}
        `;
    }
}

export default MatchEventDbEntity;

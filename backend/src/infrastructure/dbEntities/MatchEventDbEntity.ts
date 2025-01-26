import IMatchEventSchema from "infrastructure/dbSchemas/IMatchEventSchema";
import PlayerDbEntity from "./PlayerDbEntity";
import TeamDbEntity from "./TeamDbEntity";
import sql, { raw } from "sql-template-tag";

class MatchEventDbEntity implements IMatchEventSchema {
    id: string;
    match_id: string;
    player_id: string;
    team_id: string;
    type: string;
    date_occured: Date;
    secondary_player_id: string | null;
    description: string;

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
    }) {
        this.id = props.id;
        this.match_id = props.match_id;
        this.player_id = props.player_id;
        this.team_id = props.team_id;
        this.type = props.type;
        this.date_occured = props.dateOccured;
        this.secondary_player_id = props.secondary_player_id;
        this.description = props.description;
    }

    public static readonly TABLE_NAME = "match_events";

    public getInsertStatement() {
        return sql`
            INSERT INTO ${raw(MatchEventDbEntity.TABLE_NAME)} 
            (id, match_id, player_id, team_id, type, date_occured, secondary_player_id, description)
            VALUES 
            (${this.id}, ${this.match_id}, ${this.player_id}, ${this.team_id}, ${this.type}, ${this.date_occured}, ${this.secondary_player_id}, ${this.description})
        `;
    }

    public getDeleteStatement() {
        return sql`
            DELETE FROM ${raw(MatchEventDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }
}

export default MatchEventDbEntity;

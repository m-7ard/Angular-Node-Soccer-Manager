import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import TeamDbEntity from "./TeamDbEntity";
import MatchEventDbEntity from "./MatchEventDbEntity";
import IDatabaseService from "api/interfaces/IDatabaseService";
import IMatchEventSchema from "infrastructure/dbSchemas/IMatchEventSchema";
import MatchEventMapper from "infrastructure/mappers/MatchEventMapper";
import sql, { raw } from "sql-template-tag";

class MatchDbEntity implements IMatchSchema {
    id: string;
    home_team_id: string;
    away_team_id: string;
    venue: string;
    scheduled_date: Date;
    start_date: Date | null;
    end_date: Date | null;
    status: string;
    home_team_score: number | null;
    away_team_score: number | null;

    home_team: TeamDbEntity = null!;
    away_team: TeamDbEntity = null!;
    events: MatchEventDbEntity[] = [];

    public async loadMatchEvents(db: IDatabaseService): Promise<void> {
        const matchEvents = await db.queryRows<IMatchEventSchema>({ statement: `SELECT * FROM ${MatchEventDbEntity.TABLE_NAME} WHERE match_id = '${this.id}'` });
        this.events = matchEvents.map((row) => MatchEventMapper.schemaToDbEntity(row));
    }

    constructor(props: IMatchSchema) {
        this.id = props.id;
        this.home_team_id = props.home_team_id;
        this.away_team_id = props.away_team_id;
        this.venue = props.venue;
        this.scheduled_date = props.scheduled_date;
        this.start_date = props.start_date;
        this.end_date = props.end_date;
        this.status = props.status;
        this.home_team_score = props.home_team_score;
        this.away_team_score = props.away_team_score;
    }

    public static readonly TABLE_NAME = "matches";

    public getInsertEntry() {
        return sql`
            INSERT INTO ${raw(MatchDbEntity.TABLE_NAME)} 
            (id, home_team_id, away_team_id, venue, scheduled_date, start_date, end_date, status, home_team_score, away_team_score)
            VALUES 
            (${this.id}, ${this.home_team_id}, ${this.away_team_id}, ${this.venue}, ${this.scheduled_date}, ${this.start_date}, ${this.end_date}, ${this.status}, ${this.home_team_score}, ${this.away_team_score})
        `;
    }

    public getUpdateEntry() {
        return sql`
            UPDATE ${raw(MatchDbEntity.TABLE_NAME)} 
            SET 
                home_team_id = ${this.home_team_id},
                away_team_id = ${this.away_team_id},
                venue = ${this.venue},
                scheduled_date = ${this.scheduled_date},
                start_date = ${this.start_date},
                end_date = ${this.end_date},
                status = ${this.status},
                home_team_score = ${this.home_team_score},
                away_team_score = ${this.away_team_score}
            WHERE 
                id = ${this.id}
        `;
    }

    public getDeleteEntry() {
        return sql`
            DELETE FROM ${raw(MatchDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }

    public static getByIdStatement(id: MatchDbEntity["id"]) {
        return sql`
            SELECT * FROM ${raw(MatchDbEntity.TABLE_NAME)} 
            WHERE id = ${id}
        `;
    }
}

export default MatchDbEntity;

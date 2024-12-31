import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import TeamDbEntity from "./TeamDbEntity";
import MatchEventDbEntity from "./MatchEventDbEntity";
import IDatabaseService from "api/interfaces/IDatabaseService";
import IMatchEventSchema from "infrastructure/dbSchemas/IMatchEventSchema";
import MatchEventMapper from "infrastructure/mappers/MatchEventMapper";

class MatchDbEntity implements IMatchSchema {
    id: string;
    home_team_id: string;
    away_team_id: string;
    venue: string;
    scheduled_date: Date;
    start_date: Date;
    end_date: Date | null;
    status: string;
    home_team_score: number | null;
    away_team_score: number | null;
    created_at: Date;
    updated_at: Date;

    home_team: TeamDbEntity = null!;
    away_team: TeamDbEntity = null!;
    events: MatchEventDbEntity[] = [];

    public async loadMatchEvents(db: IDatabaseService): Promise<void> {
        const matchEvents = await db.query<IMatchEventSchema>({ statement: `SELECT * FROM match_events WHERE match_id = '${this.id}'` });
        this.events = matchEvents.map((row) => MatchEventMapper.schemaToDbEntity(row));
    }

    constructor(props: {
        id: string;
        home_team_id: string;
        away_team_id: string;
        venue: string;
        scheduled_date: Date;
        start_date: Date;
        end_date: Date | null;
        status: string;
        home_team_score: number | null;
        away_team_score: number | null;
        created_at: Date;
        updated_at: Date;
    }) {
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
        this.created_at = props.created_at;
        this.updated_at = props.updated_at;
    }
}

export default MatchDbEntity;

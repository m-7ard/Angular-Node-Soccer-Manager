import IDatabaseService from "../../api/interfaces/IDatabaseService";
import Match from "domain/entities/Match";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import MatchMapper from "infrastructure/mappers/MatchMapper";
import sql from "sql-template-tag";
import IMatchRepository from "application/interfaces/IMatchRepository";

class MatchRepository implements IMatchRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
    }

    async getByIdAsync(id: string): Promise<Match | null> {
        const sqlEntry = sql`SELECT * FROM matches WHERE matches.id = ${id}`;

        const [row] = await this._db.execute<IMatchSchema | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const match = MatchMapper.schemaToDbEntity(row);
        await match.loadMatchEvents(this._db);

        return match == null ? null : MatchMapper.dbEntityToDomain(match);
    }

    async createAsync(match: Match): Promise<void> {
        const dbEntity = MatchMapper.domainToDbEntity(match);

        const sqlEntry = sql`
            INSERT INTO matches
                SET 
                    id = ${dbEntity.id},
                    home_team_id = ${dbEntity.home_team_id},
                    away_team_id = ${dbEntity.away_team_id},
                    venue = ${dbEntity.venue},
                    scheduled_date = ${dbEntity.scheduled_date},
                    start_time = ${dbEntity.start_time},
                    end_time = ${dbEntity.end_time},
                    status = ${dbEntity.status},
                    home_team_score = ${dbEntity.home_team_score},
                    away_team_score = ${dbEntity.away_team_score}
        `;

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });
    }
}

export default MatchRepository;

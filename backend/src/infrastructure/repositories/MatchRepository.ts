import IDatabaseService from "../../api/interfaces/IDatabaseService";
import Match from "domain/entities/Match";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import MatchMapper from "infrastructure/mappers/MatchMapper";
import sql from "sql-template-tag";
import IMatchRepository from "application/interfaces/IMatchRepository";
import FilterAllMatchesCriteria from "infrastructure/contracts/FilterAllMatchesCriteria";
import knexQueryBuilder from "api/deps/knexQueryBuilder";

class MatchRepository implements IMatchRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
    }

    async deleteAsync(match: Match): Promise<void> {
        for (let i = 0; i < match.events.length; i++) {
            const event = match.events[i];

            const sqlEntry = sql`
                DELETE FROM match_events WHERE
                    id = ${event.id}
            `;

            const headers = await this._db.execute({
                statement: sqlEntry.sql,
                parameters: sqlEntry.values,
            });

            if (headers.affectedRows === 0) {
                throw Error(
                    `No \`match_events\` of id "${event.id}" was deleted."`,
                );
            }
        }

        const sqlEntry = sql`
            DELETE FROM matches WHERE
                id = ${match.id}
        `;

        const headers = await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (headers.affectedRows === 0) {
            throw Error(`No \`matches\` of id "${match.id} was deleted."`);
        }
    }

    async getByIdAsync(id: string): Promise<Match | null> {
        const sqlEntry = sql`SELECT * FROM matches WHERE id = ${id}`;

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
                    start_date = ${dbEntity.start_date},
                    end_date = ${dbEntity.end_date},
                    status = ${dbEntity.status},
                    home_team_score = ${dbEntity.home_team_score},
                    away_team_score = ${dbEntity.away_team_score}
        `;

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });
    }

    async filterAllAsync(criteria: FilterAllMatchesCriteria): Promise<Match[]> {
        let query = knexQueryBuilder<IMatchSchema>("matches");

        if (criteria.scheduledDate != null) {
            const startOfDay = new Date(criteria.scheduledDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(criteria.scheduledDate);
            endOfDay.setHours(24, 0, 0, 0);

            query = query.whereBetween("scheduled_date", [
                startOfDay,
                endOfDay,
            ]);
        }

        if (criteria.status != null) {
            query = query.where("status", criteria.status);
        }

        if (criteria.limitBy != null) {
            query = query.limit(criteria.limitBy);
        }

        const queryString = query.toString();

        const rows = await this._db.query<IMatchSchema>({
            statement: queryString,
        });
        const matches = rows.map(MatchMapper.schemaToDbEntity);

        for (const match of matches) {
            await match.loadMatchEvents(this._db);
        }

        return matches.map(MatchMapper.dbEntityToDomain);
    }

    async updateAsync(match: Match): Promise<void> {
        const dbEntity = MatchMapper.domainToDbEntity(match);

        const sqlEntry = sql`
            UPDATE matches
                SET 
                    id = ${dbEntity.id},
                    home_team_id = ${dbEntity.home_team_id},
                    away_team_id = ${dbEntity.away_team_id},
                    venue = ${dbEntity.venue},
                    scheduled_date = ${dbEntity.scheduled_date},
                    start_date = ${dbEntity.start_date},
                    end_date = ${dbEntity.end_date},
                    status = ${dbEntity.status},
                    home_team_score = ${dbEntity.home_team_score},
                    away_team_score = ${dbEntity.away_team_score}
                WHERE 
                    id = ${dbEntity.id}

        `;

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });
    }
}

export default MatchRepository;

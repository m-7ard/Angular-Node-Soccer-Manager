import IDatabaseService from "../../api/interfaces/IDatabaseService";
import Match from "domain/entities/Match";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import MatchMapper from "infrastructure/mappers/MatchMapper";
import IMatchRepository from "application/interfaces/IMatchRepository";
import FilterAllMatchesCriteria from "infrastructure/contracts/FilterAllMatchesCriteria";
import MatchEventPendingCreationEvent from "domain/domainEvents/Match/MatchEventPendingCreationEvent";
import MatchEventMapper from "infrastructure/mappers/MatchEventMapper";
import MatchDbEntity from "infrastructure/dbEntities/MatchDbEntity";
import { Knex } from "knex";

class MatchRepository implements IMatchRepository {
    private readonly db: IDatabaseService;
    private readonly queryBuilder: Knex;

    constructor(db: IDatabaseService, queryBuiler: Knex) {
        this.db = db;
        this.queryBuilder = queryBuiler;
    }

    private async persistDomainEvents(match: Match) {
        for (let i = 0; i < match.domainEvents.length; i++) {
            const event = match.domainEvents[i];

            if (event instanceof MatchEventPendingCreationEvent) {
                const matchEvent = event.payload;
                const dbEntity = MatchEventMapper.domainToDbEntity(matchEvent);
                const sqlEntry = dbEntity.getInsertStatement();

                await this.db.executeHeaders({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            }
        }

        match.clearEvents();
    }

    async deleteAsync(match: Match): Promise<void> {
        for (let i = 0; i < match.events.length; i++) {
            const dbEntity = MatchEventMapper.domainToDbEntity(match.events[i]);
            const sqlEntry = dbEntity.getDeleteStatement();

            const headers = await this.db.executeHeaders({
                statement: sqlEntry.sql,
                parameters: sqlEntry.values,
            });

            if (headers.affectedRows === 0) {
                throw Error(`No \`match_events\` of id "${dbEntity.id}" was deleted."`);
            }
        }

        const dbEntity = MatchMapper.domainToDbEntity(match);
        const sqlEntry = dbEntity.getDeleteEntry();

        const headers = await this.db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (headers.affectedRows === 0) {
            throw Error(`No \`matches\` of id "${dbEntity.id} was deleted."`);
        }
    }

    async getByIdAsync(id: string): Promise<Match | null> {
        const sqlEntry = MatchDbEntity.getByIdStatement(id);
        const [row] = await this.db.executeRows<IMatchSchema | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const match = MatchMapper.schemaToDbEntity(row);
        await match.loadMatchEvents(this.db);

        return match == null ? null : MatchMapper.dbEntityToDomain(match);
    }

    async createAsync(match: Match): Promise<void> {
        const dbEntity = MatchMapper.domainToDbEntity(match);
        const sqlEntry = dbEntity.getInsertEntry();

        await this.db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        await this.persistDomainEvents(match);
    }

    async filterAllAsync(criteria: FilterAllMatchesCriteria): Promise<Match[]> {
        let query = this.queryBuilder<IMatchSchema>("matches");

        if (criteria.scheduledDate != null) {
            const startOfDay = new Date(criteria.scheduledDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(criteria.scheduledDate);
            endOfDay.setHours(24, 0, 0, 0);

            query = query.whereBetween("scheduled_date", [startOfDay, endOfDay]);
        }

        if (criteria.status != null) {
            query = query.where("status", criteria.status);
        }

        if (criteria.limitBy != null) {
            query = query.limit(criteria.limitBy);
        }

        if (criteria.teamId != null) {
            query = query.where("away_team_id", criteria.teamId).orWhere("home_team_id", criteria.teamId);
        } 

        const queryString = query.toString();

        const rows = await this.db.queryRows<IMatchSchema>({
            statement: queryString,
        });
        const matches = rows.map(MatchMapper.schemaToDbEntity);

        for (const match of matches) {
            await match.loadMatchEvents(this.db);
        }

        return matches.map(MatchMapper.dbEntityToDomain);
    }

    async updateAsync(match: Match): Promise<void> {
        const dbEntity = MatchMapper.domainToDbEntity(match);
        const sqlEntry = dbEntity.getUpdateEntry();

        await this.db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        await this.persistDomainEvents(match);
    }
}

export default MatchRepository;

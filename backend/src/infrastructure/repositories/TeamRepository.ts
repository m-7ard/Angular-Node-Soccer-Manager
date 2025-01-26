import TeamMembershipPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipPendingCreationEvent";
import IDatabaseService from "../../api/interfaces/IDatabaseService";
import ITeamRepository from "../../application/interfaces/ITeamRepository";
import Team from "domain/entities/Team";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import TeamMapper from "infrastructure/mappers/TeamMapper";
import knexQueryBuilder from "api/deps/knexQueryBuilder";
import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";
import TeamMembershipPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipPendingDeletionEvent";
import TeamMembershipPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipPendingUpdatingEvent";
import TeamMembershipHistoryPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingCreationEvent";
import TeamMembershipHistoryMapper from "infrastructure/mappers/TeamMembershipHistoryMapper";
import TeamMembershipHistoryPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingUpdatingEvent";
import TeamId from "domain/valueObjects/Team/TeamId";
import TeamMembershipMapper from "infrastructure/mappers/TeamMembershipMapper";
import TeamDbEntity from "infrastructure/dbEntities/TeamDbEntity";
import TeamMembershipHistoryPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingDeletionEvent";

class TeamRepository implements ITeamRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
    }

    private async persistDomainEvents(team: Team) {
        for (let i = 0; i < team.domainEvents.length; i++) {
            const event = team.domainEvents[i];

            if (event instanceof TeamMembershipPendingCreationEvent) {
                const teamMembership = event.payload;
                const dbEntity = TeamMembershipMapper.domainToDbEntity(teamMembership);
                const sqlEntry = dbEntity.getInsertEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipPendingDeletionEvent) {
                const dbEntity = TeamMembershipMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getDeleteEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipPendingUpdatingEvent) {
                const dbEntity = TeamMembershipMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getUpdateEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingCreationEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getInsertEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingUpdatingEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getUpdateEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingDeletionEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getDeleteEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            }
        }

        team.clearEvents();
    }

    async getByIdAsync(id: TeamId): Promise<Team | null> {
        const sqlEntry = TeamDbEntity.getByIdStatement(id.value);
        const [row] = await this._db.executeRows<ITeamSchema | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const team = TeamMapper.schemaToDbEntity(row);
        await team.loadTeamMemberships(this._db);

        for (let i = 0; i < team.team_memberships.length; i++) {
            const teamMembership = team.team_memberships[i];
            await teamMembership.loadTeamMembershipHistories(this._db);
        }

        return team == null ? null : TeamMapper.dbEntityToDomain(team);
    }

    async createAsync(team: Team): Promise<void> {
        const dbEntity = TeamMapper.domainToDbEntity(team);
        const sqlEntry = dbEntity.getInsertEntry();

        await this._db.executeRows({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        await this.persistDomainEvents(team);
    }

    async updateAsync(team: Team): Promise<void> {
        const dbEntity = TeamMapper.domainToDbEntity(team);
        const sqlEntry = dbEntity.getUpdateEntry();

        await this._db.executeRows({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        await this.persistDomainEvents(team);
    }

    async filterAllAsync(criteria: FilterAllTeamsCriteria): Promise<Team[]> {
        let query = knexQueryBuilder<ITeamSchema>("team");

        if (criteria.name != null) {
            query.whereILike("team.name", `%${criteria.name}%`);
        }

        if (criteria.teamMembershipPlayerId != null) {
            query = query
                .join("team_membership", "team.id", "team_membership.team_id")
                .where("team_membership.player_id", criteria.teamMembershipPlayerId.value)
                .select("team.*")
                .distinct();
        }

        if (criteria.limitBy) {
            query = query.limit(criteria.limitBy);
        }

        const rows = await this._db.queryRows<ITeamSchema>({
            statement: query.toString(),
        });
        const teams = rows.map(TeamMapper.schemaToDbEntity);

        for (const team of teams) {
            await team.loadTeamMemberships(this._db);

            for (let i = 0; i < team.team_memberships.length; i++) {
                const teamMembership = team.team_memberships[i];
                await teamMembership.loadTeamMembershipHistories(this._db);
            }
        }

        return teams.map(TeamMapper.dbEntityToDomain);
    }

    async deleteAsync(team: Team): Promise<void> {
        for (let i = 0; i < team.teamMemberships.length; i++) {
            const teamMembership = team.teamMemberships[i];
            const dbEntity = TeamMembershipMapper.domainToDbEntity(teamMembership);
            const sqlEntry = dbEntity.getDeleteEntry();

            const headers = await this._db.executeHeaders({
                statement: sqlEntry.sql,
                parameters: sqlEntry.values,
            });

            if (headers.affectedRows === 0) {
                throw Error(`No team_membership of id "${teamMembership.id}" was deleted."`);
            }
        }

        const dbEntity = TeamMapper.domainToDbEntity(team);
        const sqlEntry = dbEntity.getDeleteEntry();

        const headers = await this._db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (headers.affectedRows === 0) {
            throw Error(`No team of id "${team.id} was deleted."`);
        }
    }
}

export default TeamRepository;

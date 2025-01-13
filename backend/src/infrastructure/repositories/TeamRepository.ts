import TeamMembershipPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipPendingCreationEvent";
import IDatabaseService from "../../api/interfaces/IDatabaseService";
import ITeamRepository from "../../application/interfaces/ITeamRepository";
import Team from "domain/entities/Team";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import TeamMapper from "infrastructure/mappers/TeamMapper";
import sql from "sql-template-tag";
import knexQueryBuilder from "api/deps/knexQueryBuilder";
import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";
import TeamMembershipPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipPendingDeletionEvent";
import TeamMembershipPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipPendingUpdatingEvent";
import TeamMembershipHistoryPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingCreationEvent";
import TeamMembershipHistoryMapper from "infrastructure/mappers/TeamMembershipHistoryMapper";
import TeamMembershipHistoryPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingUpdatingEvent";

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

                const sqlEntry = sql`
                    INSERT INTO team_membership
                        SET 
                            id = ${teamMembership.id},
                            team_id = ${teamMembership.teamId},
                            player_id = ${teamMembership.playerId},
                            active_from = ${teamMembership.teamMembershipDates.activeFrom},
                            active_to = ${teamMembership.teamMembershipDates.activeTo}
                `;

                await this._db.execute({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipPendingDeletionEvent) {
                const teamMembership = event.payload;

                const sqlEntry = sql`
                    DELETE FROM team_membership
                        WHERE id = ${teamMembership.id}
                `;

                await this._db.execute({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipPendingUpdatingEvent) {
                const teamMembership = event.payload;

                const sqlEntry = sql`
                    UPDATE team_membership
                        SET 
                            team_id = ${teamMembership.teamId},
                            player_id = ${teamMembership.playerId},
                            active_from = ${teamMembership.teamMembershipDates.activeFrom},
                            active_to = ${teamMembership.teamMembershipDates.activeTo}
                        WHERE
                            id = ${teamMembership.id}
                `;

                await this._db.execute({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingCreationEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);

                const sqlEntry = sql`
                    INSERT INTO team_membership_histories
                        SET 
                            id = ${dbEntity.id},
                            team_membership_id = ${dbEntity.team_membership_id},
                            date_effective_from = ${dbEntity.date_effective_from},
                            number = ${dbEntity.number},
                            position = ${dbEntity.position}
                `;

                await this._db.execute({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingUpdatingEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);

                const sqlEntry = sql`
                    UPDATE team_membership_histories
                        SET 
                            team_membership_id = ${dbEntity.team_membership_id},
                            date_effective_from = ${dbEntity.date_effective_from},
                            number = ${dbEntity.number},
                            position = ${dbEntity.position}
                        WHERE
                            id = ${dbEntity.id} 
                `;

                await this._db.execute({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            }
        }

        team.clearEvents();
    }

    async getByIdAsync(id: string): Promise<Team | null> {
        const sqlEntry = sql`SELECT * FROM team WHERE team.id = ${id}`;

        const [row] = await this._db.execute<ITeamSchema | null>({
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
        const sqlEntry = sql`
            INSERT INTO team
                SET 
                    id = ${team.id},
                    name = ${team.name},
                    date_founded = ${team.dateFounded}
        `;

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        await this.persistDomainEvents(team);
    }

    async updateAsync(team: Team): Promise<void> {
        const sqlEntry = sql`
            UPDATE team
                SET 
                    id = ${team.id},
                    name = ${team.name},
                    date_founded = ${team.dateFounded}
                WHERE
                    id = ${team.id}
        `;

        await this._db.execute({
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
                .where(
                    "team_membership.player_id",
                    criteria.teamMembershipPlayerId,
                )
                .select("team.*")
                .distinct();
        }

        if (criteria.limitBy) {
            query = query.limit(criteria.limitBy);
        }

        const rows = await this._db.query<ITeamSchema>({
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

            const sqlEntry = sql`
                DELETE FROM team_teamship WHERE
                    id = ${teamMembership.id}
            `;

            const headers = await this._db.execute({
                statement: sqlEntry.sql,
                parameters: sqlEntry.values,
            });

            if (headers.affectedRows === 0) {
                throw Error(
                    `No team_membership of id "${teamMembership.id}" was deleted."`,
                );
            }
        }

        const sqlEntry = sql`
            DELETE FROM team WHERE
                id = ${team.id}
        `;

        const headers = await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (headers.affectedRows === 0) {
            throw Error(`No team of id "${team.id} was deleted."`);
        }
    }
}

export default TeamRepository;

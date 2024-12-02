import TeamMembershipCreatedEvent from "domain/domainEvents/Team/TeamMembershipCreatedEvent";
import IDatabaseService from "../../api/interfaces/IDatabaseService";
import ITeamRepository from "../../application/interfaces/ITeamRepository";
import Team from "domain/entities/Team";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import TeamMapper from "infrastructure/mappers/TeamMapper";
import sql from "sql-template-tag";

class TeamRepository implements ITeamRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
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
    }

    async updateAsync(team: Team): Promise<void> {
        const sqlEntry = sql`
            UPDATE team
                SET 
                    id = ${team.id},
                    name = ${team.name},
                    date_founded = ${team.dateFounded}
        `;

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        for (let i = 0; i < team.domainEvents.length; i++) {
            const event = team.domainEvents[i];

            if (event instanceof TeamMembershipCreatedEvent) {
                const teamMembership = event.payload;
            
                const sqlEntry = sql`
                    INSERT INTO team_membership
                        SET 
                            id = ${teamMembership.id},
                            team_id = ${teamMembership.teamId},
                            player_id = ${teamMembership.playerId},
                            active_from = ${teamMembership.activeFrom},
                            active_to = ${teamMembership.activeTo},
                            number = ${teamMembership.number}
                `;

                await this._db.execute({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            }

            team.clearEvents();
        }
    }

    async findAllAsync(): Promise<Team[]> {
        const sqlEntry = sql`SELECT * FROM team`;
        const rows = await this._db.execute<ITeamSchema>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });
        const teams = rows.map(TeamMapper.schemaToDbEntity);

        for (const team of teams) {
            await team.loadTeamMemberships(this._db);
        }
        
        return teams.map(TeamMapper.dbEntityToDomain);
    }
}

export default TeamRepository;

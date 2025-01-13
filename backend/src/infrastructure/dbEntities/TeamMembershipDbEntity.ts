import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import TeamDbEntity from "./TeamDbEntity";
import PlayerDbEntity from "./PlayerDbEntity";
import TeamMembershipHistoryDbEntity from "./TeamMembershipHistoryDbEntity";
import IDatabaseService from "api/interfaces/IDatabaseService";
import TeamMembershipHistoryMapper from "infrastructure/mappers/TeamMembershipHistoryMapper";
import ITeamMembershipHistorySchema from "infrastructure/dbSchemas/ITeamMembershipHistorySchema";
import sql from "sql-template-tag";

class TeamMembershipDbEntity implements ITeamMembershipSchema {
    constructor(props: ITeamMembershipSchema) {
        this.id = props.id;
        this.team_id = props.team_id;
        this.player_id = props.player_id;
        this.active_from = props.active_from;
        this.active_to = props.active_to;
    }

    public id: string;
    public team_id: string;
    public player_id: string;
    public active_from: Date;
    public active_to: Date | null;

    public team_membership_histories: TeamMembershipHistoryDbEntity[] = [];
    public team: TeamDbEntity | null = null;
    public player: PlayerDbEntity | null = null;

    public async loadTeamMembershipHistories(db: IDatabaseService): Promise<void> {
        const teamMembershipHistories = await db.query<ITeamMembershipHistorySchema>({ statement: `SELECT * FROM team_membership_histories WHERE team_membership_id = '${this.id}'` });
        this.team_membership_histories = teamMembershipHistories.map((row) => TeamMembershipHistoryMapper.schemaToDbEntity(row));
    }


    public getInsertEntry() {
        return sql`
            INSERT INTO team_membership
                SET 
                    id = ${this.id},
                    team_id = ${this.team_id},
                    player_id = ${this.player_id},
                    active_from = ${this.active_from},
                    active_to = ${this.active_to}
        `
    }
    
    public getUpdateEntry() {
        return sql`
            UPDATE team_membership
                SET 
                    team_id = ${this.team_id},
                    player_id = ${this.player_id},
                    active_from = ${this.active_from},
                    active_to = ${this.active_to}
                WHERE
                    id = ${this.id}
        `
    }

    public getDeleteEntry() {
        return sql`
            DELETE FROM team_membership
                WHERE id = ${this.id}
        `
    }
}

export default TeamMembershipDbEntity;

import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import TeamMembershipDbEntity from "./TeamMembershipDbEntity";
import IDatabaseService from "api/interfaces/IDatabaseService";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import TeamMembershipMapper from "infrastructure/mappers/TeamMembershipMapper";

class TeamDbEntity implements ITeamSchema {
    constructor(props: { id: string; name: string; date_founded: Date }) {
        this.id = props.id;
        this.name = props.name;
        this.date_founded = props.date_founded;
    }

    public async loadTeamMemberships(db: IDatabaseService): Promise<void> {
        const teamMemberships = await db.query<ITeamMembershipSchema>({ statement: `SELECT * FROM team_membership WHERE team_id = '${this.id}'` });
        this.team_memberships = teamMemberships.map((row) => TeamMembershipMapper.schemaToDbEntity(row));
    }

    public id: string;
    public name: string;
    public date_founded: Date;
    
    public team_memberships: TeamMembershipDbEntity[] = [];
}

export default TeamDbEntity;

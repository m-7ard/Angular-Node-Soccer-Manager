import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import TeamMembershipDbEntity from "./TeamMembershipDbEntity";
import IDatabaseService from "api/interfaces/IDatabaseService";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import TeamMembershipMapper from "infrastructure/mappers/TeamMembershipMapper";
import sql, { raw } from "sql-template-tag";

class TeamDbEntity implements ITeamSchema {
    constructor(props: { id: string; name: string; date_founded: Date }) {
        this.id = props.id;
        this.name = props.name;
        this.date_founded = props.date_founded;
    }

    public async loadTeamMemberships(db: IDatabaseService): Promise<void> {
        const teamMemberships = await db.queryRows<ITeamMembershipSchema>({ statement: `SELECT * FROM ${TeamMembershipDbEntity.TABLE_NAME} WHERE team_id = '${this.id}'` });
        this.team_memberships = teamMemberships.map((row) => TeamMembershipMapper.schemaToDbEntity(row));
    }

    public id: string;
    public name: string;
    public date_founded: Date;

    public team_memberships: TeamMembershipDbEntity[] = [];

    public static readonly TABLE_NAME = "team";

    public getInsertEntry() {
        return sql`
            INSERT INTO ${raw(TeamDbEntity.TABLE_NAME)} 
            (id, name, date_founded)
            VALUES 
            (${this.id}, ${this.name}, ${this.date_founded})
        `;
    }

    public getUpdateEntry() {
        return sql`
            UPDATE ${raw(TeamDbEntity.TABLE_NAME)} 
            SET 
                name = ${this.name},
                date_founded = ${this.date_founded}
            WHERE
                id = ${this.id}
        `;
    }

    public getDeleteEntry() {
        return sql`
            DELETE FROM ${raw(TeamDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }

    public static getByIdStatement(id: TeamDbEntity["id"]) {
        return sql`
            SELECT * 
            FROM ${raw(TeamDbEntity.TABLE_NAME)} 
            WHERE ${raw(TeamDbEntity.TABLE_NAME)}.id = ${id}
        `;
    }
}

export default TeamDbEntity;

import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import TeamMembershipDbEntity from "./TeamMembershipDbEntity";
import sql, { raw } from "sql-template-tag";

class PlayerDbEntity implements IPlayerSchema {
    constructor(props: { id: string; name: string; active_since: Date }) {
        this.id = props.id;
        this.name = props.name;
        this.active_since = props.active_since;
    }

    public id: string;
    public name: string;
    public active_since: Date;

    public team_memberships: TeamMembershipDbEntity[] = [];
    public static readonly TABLE_NAME = "player";

    public getDeleteStatement() {
        return sql`
            DELETE FROM ${raw(PlayerDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }

    public getInsertStatement() {
        return sql`
            INSERT INTO ${raw(PlayerDbEntity.TABLE_NAME)} 
            (id, name, active_since) 
            VALUES 
            (${this.id}, ${this.name}, ${this.active_since})
        `;
    }

    public getUpdateStatement() {
        return sql`
            UPDATE ${raw(PlayerDbEntity.TABLE_NAME)} 
            SET
                name = ${this.name},
                active_since = ${this.active_since}
            WHERE
                id = ${this.id}
        `;
    }

    public static getByIdStatement(id: PlayerDbEntity["id"]) {
        return sql`
            SELECT * FROM ${raw(PlayerDbEntity.TABLE_NAME)} 
            WHERE id = ${id}
        `;
    }
}

export default PlayerDbEntity;

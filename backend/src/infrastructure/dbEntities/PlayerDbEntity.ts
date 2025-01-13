import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import TeamMembershipDbEntity from "./TeamMembershipDbEntity";
import sql from "sql-template-tag";

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

    public getDeleteStatement() {
        return sql`
            DELETE FROM player WHERE
                id = ${this.id}
        `;
    }

    public getInsertStatement() {
        return sql`
            INSERT INTO player
                SET 
                    id = ${this.id},
                    name = ${this.name},
                    active_since = ${this.active_since}
        `;
    }

    public getUpdateStatement() {
        return sql`
            UPDATE player
                SET
                    name = ${this.name},
                    active_since = ${this.active_since}
                WHERE
                    id = ${this.id}
        `;
    }

    public static getByIdStatement(id: PlayerDbEntity["id"]) {
        return sql`
            SELECT * FROM player WHERE
                id = ${id}
        `;
    }
}

export default PlayerDbEntity;

import ITeamMembershipHistorySchema from "infrastructure/dbSchemas/ITeamMembershipHistorySchema";
import sql from "sql-template-tag";

class TeamMembershipHistoryDbEntity implements ITeamMembershipHistorySchema {
    constructor(props: ITeamMembershipHistorySchema) {
        this.id = props.id;
        this.team_membership_id = props.team_membership_id;
        this.date_effective_from = props.date_effective_from;
        this.number = props.number;
        this.position = props.position;
    }

    id: string;
    team_membership_id: string;
    date_effective_from: Date;
    number: number;
    position: string;

    public getInsertEntry() {
        return sql`
            INSERT INTO team_membership_histories
                SET 
                    id = ${this.id},
                    team_membership_id = ${this.team_membership_id},
                    date_effective_from = ${this.date_effective_from},
                    number = ${this.number},
                    position = ${this.position}
        `;
    }

    public getUpdateEntry() {
        return sql`
            UPDATE team_membership_histories
                SET 
                    team_membership_id = ${this.team_membership_id},
                    date_effective_from = ${this.date_effective_from},
                    number = ${this.number},
                    position = ${this.position}
                WHERE
                    id = ${this.id} 
        `;
    }
}

export default TeamMembershipHistoryDbEntity;

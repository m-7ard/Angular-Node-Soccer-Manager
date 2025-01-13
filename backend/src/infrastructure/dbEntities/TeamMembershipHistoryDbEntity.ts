import ITeamMembershipHistorySchema from "infrastructure/dbSchemas/ITeamMembershipHistorySchema";

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
}

export default TeamMembershipHistoryDbEntity;

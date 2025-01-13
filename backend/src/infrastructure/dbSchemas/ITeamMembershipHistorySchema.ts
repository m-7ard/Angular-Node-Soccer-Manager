import ITeamMembershipSchema from "./ITeamMembershipSchema";

interface ITeamMembershipHistorySchema {
    id: string;
    team_membership_id: ITeamMembershipSchema["id"];
    date_effective_from: Date;
    number: number;
    position: string;
}

export default ITeamMembershipHistorySchema;

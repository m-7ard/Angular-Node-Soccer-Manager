import ITeamMembershipSchema from "./ITeamMembershipSchema";

export default interface IPlayerSchema {
    id: string;
    name: string;
    activeSince: Date;
}

export interface IPlayerRelations {
    team_memberships: ITeamMembershipSchema[];
}
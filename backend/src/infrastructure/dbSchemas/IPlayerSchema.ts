import ITeamMembershipSchema from "./ITeamMembershipSchema";

export default interface IPlayerSchema {
    id: string;
    name: string;
    activeSince: Date;
    number: number;
}

export interface IPlayerRelations {
    team_memberships: ITeamMembershipSchema[];
}
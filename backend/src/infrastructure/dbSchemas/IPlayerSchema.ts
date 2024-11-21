import ITeamMembershipSchema from "./ITeamMembershipSchema";

export default interface IPlayerSchema {
    id: string;
    name: string;
    active_since: Date;
    number: number;
}

export interface IPlayerRelations {
    team_memberships: ITeamMembershipSchema[];
}
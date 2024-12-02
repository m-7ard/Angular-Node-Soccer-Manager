import ITeamMembershipSchema from "./ITeamMembershipSchema";

export default interface IPlayerSchema {
    id: string;
    name: string;
    active_since: Date;
}

export interface IPlayerRelations {
    team_memberships: ITeamMembershipSchema[];
}
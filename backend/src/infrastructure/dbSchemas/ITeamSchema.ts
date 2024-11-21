import ITeamMembershipSchema from "./ITeamMembershipSchema";

export default interface ITeamSchema {
    id: string;
    name: string;
    date_founded: Date;
}

export interface ITeamRelations { 
    team_memberships: ITeamMembershipSchema[];
}
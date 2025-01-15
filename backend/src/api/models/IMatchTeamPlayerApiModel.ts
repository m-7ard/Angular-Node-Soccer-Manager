import ITeamMembershipHistoryApiModel from "./ITeamMembershipHistoryApiModel";

interface IMatchTeamPlayerApiModel {
    id: string;
    teamMembershipHistory: ITeamMembershipHistoryApiModel | null;
}

export default IMatchTeamPlayerApiModel;
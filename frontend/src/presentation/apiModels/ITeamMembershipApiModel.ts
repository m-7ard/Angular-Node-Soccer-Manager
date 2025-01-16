import ITeamMembershipHistoryApiModel from "./ITeamMembershipHistoryApiModel";

interface ITeamMembershipApiModel {
    id: string;
    teamId: string;
    playerId: string;
    activeFrom: string;
    activeTo: string | null;
    effectiveHistory: ITeamMembershipHistoryApiModel | null
}

export default ITeamMembershipApiModel;
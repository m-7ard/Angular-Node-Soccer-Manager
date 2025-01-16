import ITeamApiModel from "@apiModels/ITeamApiModel";
import ITeamMembershipHistoryApiModel from "@apiModels/ITeamMembershipHistoryApiModel";
import ITeamPlayerApiModel from "@apiModels/ITeamPlayerApiModel";

interface IListTeamMembershipHistoriesResponseDTO {
    team: ITeamApiModel;
    teamPlayer: ITeamPlayerApiModel;
    teamMembershipHistories: ITeamMembershipHistoryApiModel[];
}

export default IListTeamMembershipHistoriesResponseDTO;

import ITeamApiModel from "@apiModels/ITeamApiModel";
import ITeamPlayerApiModel from "@apiModels/ITeamPlayerApiModel";

interface IReadTeamPlayerResponseDTO {
    team: ITeamApiModel;
    teamPlayer: ITeamPlayerApiModel;
}

export default IReadTeamPlayerResponseDTO;

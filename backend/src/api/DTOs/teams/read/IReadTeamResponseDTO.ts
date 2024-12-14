import ITeamApiModel from "@apiModels/ITeamApiModel";
import ITeamPlayerApiModel from "@apiModels/ITeamPlayerApiModel";

interface IReadTeamResponseDTO {
    team: ITeamApiModel;
    teamPlayers: ITeamPlayerApiModel[]
}

export default IReadTeamResponseDTO;

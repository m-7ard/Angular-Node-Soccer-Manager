import ITeamApiModel from "api/models/ITeamApiModel";
import ITeamPlayerApiModel from "api/models/ITeamPlayerApiModel";

interface IListTeamPlayersResponseDTO {
    team: ITeamApiModel;
    teamPlayers: ITeamPlayerApiModel[];
}

export default IListTeamPlayersResponseDTO;

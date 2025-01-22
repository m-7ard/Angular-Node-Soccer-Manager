import IPlayerApiModel from "@apiModels/IPlayerApiModel";
import ITeamApiModel from "@apiModels/ITeamApiModel";

interface IReadFullPlayerResponseDTO {
    player: IPlayerApiModel;
    currentTeams: ITeamApiModel[];
    formerTeams: ITeamApiModel[];
}

export default IReadFullPlayerResponseDTO;

import ITeamApiModel from '../../../apiModels/ITeamApiModel';
import ITeamPlayerApiModel from '../../../apiModels/ITeamPlayerApiModel';

interface IListTeamPlayersResponseDTO {
    team: ITeamApiModel;
    teamPlayers: ITeamPlayerApiModel[];
}

export default IListTeamPlayersResponseDTO;

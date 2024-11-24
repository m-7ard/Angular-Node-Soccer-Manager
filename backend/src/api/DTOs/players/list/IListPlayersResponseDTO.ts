import IPlayerApiModel from "api/models/IPlayerApiModel";

interface IListPlayersResponseDTO {
    players: IPlayerApiModel[];
}

export default IListPlayersResponseDTO;

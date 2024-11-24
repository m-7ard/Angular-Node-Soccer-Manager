import IPlayerApiModel from "./IPlayerApiModel";

export default interface IFullTeamApiModel {
    id: string;
    name: string;
    dateFounded: string;
    players: IPlayerApiModel[]
}

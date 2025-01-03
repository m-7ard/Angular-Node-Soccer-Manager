import IPlayerApiModel from "./IPlayerApiModel";

export default interface IMatchEventApiModel {
    id: string;
    matchId: string;
    player: IPlayerApiModel;
    teamId: string;
    type: string;
    dateOccured: string;
    secondaryPlayer: IPlayerApiModel | null;
    description: string;
}

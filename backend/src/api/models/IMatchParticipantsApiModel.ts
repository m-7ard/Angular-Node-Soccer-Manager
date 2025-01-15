import IMatchTeamPlayerApiModel from "./IMatchPlayerApiModel";

interface IMatchParticipantsApiModel {
    homeTeamPlayers: IMatchTeamPlayerApiModel[];
    awayTeamPlayers: IMatchTeamPlayerApiModel[];
}

export default IMatchParticipantsApiModel;
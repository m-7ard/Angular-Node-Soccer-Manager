import IMatchApiModel from "@apiModels/IMatchApiModel";
import IMatchEventApiModel from "@apiModels/IMatchEventApiModel";
import IMatchParticipantsApiModel from "@apiModels/IMatchParticipantsApiModel";

interface IReadMatchResponseDTO {
    match: IMatchApiModel;
    matchEvents: IMatchEventApiModel[];
    matchParticipants: IMatchParticipantsApiModel;
}

export default IReadMatchResponseDTO;

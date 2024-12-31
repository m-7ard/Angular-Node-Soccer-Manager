import IMatchApiModel from "@apiModels/IMatchApiModel";
import IMatchEventApiModel from "@apiModels/IMatchEventApiModel";

interface IReadMatchResponseDTO {
    match: IMatchApiModel;
    matchEvents: IMatchEventApiModel[];
}

export default IReadMatchResponseDTO;

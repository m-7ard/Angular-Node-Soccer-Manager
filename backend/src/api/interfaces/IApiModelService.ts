import IMatchApiModel from "@apiModels/IMatchApiModel";
import IMatchEventApiModel from "@apiModels/IMatchEventApiModel";
import Match from "domain/entities/Match";
import MatchEvent from "domain/entities/MatchEvent";

interface IApiModelService {
    createMatchApiModel(match: Match): Promise<IMatchApiModel>;
    createManyMatchApiModels(matches: Match[]): Promise<IMatchApiModel[]>
    createMatchEventApiModel(match: MatchEvent): Promise<IMatchEventApiModel>;
    createManyMatchEventApiModel(match: MatchEvent[]): Promise<IMatchEventApiModel[]>;
}

export default IApiModelService;
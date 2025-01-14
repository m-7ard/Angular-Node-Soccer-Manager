import IGoalData from "application/contracts/IGoalData";
import IApplicationError from "application/errors/IApplicationError";
import Match from "domain/entities/Match";
import { Result } from "neverthrow";

interface IAddGoalService {
    tryAddGoal(goal: IGoalData): Promise<Result<true, IApplicationError[]>>;
}

export interface IAddGoalServiceFactory {
    create(match: Match): IAddGoalService
}

export default IAddGoalService;
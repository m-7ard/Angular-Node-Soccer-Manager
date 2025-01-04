import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IValidator from "application/interfaces/IValidator";
import Match from "domain/entities/Match";
import { err, ok, Result } from "neverthrow";

class CanAddGoalValidator implements IValidator<{ dateOccured: Date; teamId: string; playerId: string }, true> {
    constructor(private readonly match: Match) {}

    validate(input: { dateOccured: Date; teamId: string; playerId: string }): Result<true, IApplicationError[]> {
        const canAddGoalResult = this.match.canAddGoal(input);

        if (canAddGoalResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddGoalResult.error,
                    path: [],
                    code: APPLICATION_VALIDATOR_CODES.CAN_ADD_GOAL_ERROR,
                }),
            );
        }

        return ok(true);
    }
}

export default CanAddGoalValidator;

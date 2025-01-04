import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IValidator from "application/interfaces/IValidator";
import Match from "domain/entities/Match";
import { err, ok, Result } from "neverthrow";

class IsMatchTeamValidator implements IValidator<{ teamId: string }, true> {
    constructor(private readonly match: Match) {}

    validate(input: { teamId: string }): Result<true, IApplicationError[]> {
        const { teamId } = input;

        const isMatchTeam = teamId === this.match.awayTeamId || teamId === this.match.homeTeamId;
        if (!isMatchTeam) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: APPLICATION_VALIDATOR_CODES.IS_MATCH_TEAM_ERROR,
                    message: `Team of id "${teamId}" is not part of the match.`,
                    path: [],
                }),
            );
        }

        return ok(true);
    }
}

export default IsMatchTeamValidator;

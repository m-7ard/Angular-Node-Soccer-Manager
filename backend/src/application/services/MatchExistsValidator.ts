import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IApplicationError from "application/errors/IApplicationError";
import IMatchRepository from "application/interfaces/IMatchRepository";
import IValidator from "application/interfaces/IValidator";
import Match from "domain/entities/Match";
import { err, ok, Result } from "neverthrow";

class MatchExistsValidator implements IValidator<{ id: string }, Match> {
    constructor(private readonly matchRepository: IMatchRepository) {}

    async validate(input: { id: string }): Promise<Result<Match, IApplicationError[]>> {
        const match = await this.matchRepository.getByIdAsync(input.id);

        if (match == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Match of id "${input.id}" does not exist.`,
                    code: APPLICATION_SERVICE_CODES.MATCH_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(match);
    }
}

export default MatchExistsValidator;

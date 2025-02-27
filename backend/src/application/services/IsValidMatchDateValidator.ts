import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IApplicationError from "application/errors/IApplicationError";
import IValidator from "application/interfaces/IValidator";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import { err, ok, Result } from "neverthrow";

/* Reduntant validator */

class IsValidMatchDatesValidator implements IValidator<{ scheduledDate: Date; startDate: Date | null; endDate: Date | null }, true> {
    validate(input: { scheduledDate: Date; startDate: Date | null; endDate: Date | null }): Result<true, IApplicationError[]> {
        const createMatchDatesResults = MatchDates.canCreate(input);
        if (createMatchDatesResults.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: createMatchDatesResults.error,
                    code: APPLICATION_SERVICE_CODES.IS_VALID_MATCH_DATES_ERROR,
                    path: [],
                }),
            );
        }

        return ok(createMatchDatesResults.value);
    }
}

export default IsValidMatchDatesValidator;

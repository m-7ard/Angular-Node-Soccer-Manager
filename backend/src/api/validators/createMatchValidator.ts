import ICreateMatchRequestDTO from "api/DTOs/matches/create/ICreateMatchRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { string, nullable, date, object, record } from "superstruct";

const validatorSchema = object({
    homeTeamId: string(),
    awayTeamId: string(),
    venue: string(),
    scheduledDate: date(),
    startDate: nullable(date()),
    endDate: nullable(date()),
    status: string(),
    goals: nullable(
        record(
            string(),
            object({
                dateOccured: date(),
                teamId: string(),
                playerId: string(),
            }),
        ),
    ),
});

function createMatchValidator(data: ICreateMatchRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default createMatchValidator;


import ICreateMatchRequestDTO from "api/DTOs/matches/create/ICreateMatchRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { string, nullable, number, date, object, min, max } from "superstruct";

const validatorSchema = object({
    homeTeamId: string(),
    awayTeamId: string(),
    venue: string(),
    scheduledDate: date(),
    startTime: date(),
    endTime: nullable(date()),
    status: string(),
    homeTeamScore: nullable(max(min(number(), 0), 100)),
    awayTeamScore: nullable(max(min(number(), 0), 100)),
});

function createMatchValidator(data: ICreateMatchRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default createMatchValidator;
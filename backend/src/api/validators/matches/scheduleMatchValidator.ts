import IScheduleMatchRequestDTO from "api/DTOs/matches/schedule/IScheduleMatchRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { string, date, object } from "superstruct";

const validatorSchema = object({
    homeTeamId: string(),
    awayTeamId: string(),
    venue: string(),
    scheduledDate: date(),
});

function scheduleMatchValidator(data: IScheduleMatchRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default scheduleMatchValidator;

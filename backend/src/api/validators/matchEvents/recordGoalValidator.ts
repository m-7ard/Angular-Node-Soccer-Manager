import IRecordGoalRequestDTO from "api/DTOs/matchEvents/recordGoal/IRecordGoalRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { string, date, object } from "superstruct";

const validatorSchema = object({
    teamId: string(),
    playerId: string(),
    dateOccured: date(),
});

function recordGoalValidator(data: IRecordGoalRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default recordGoalValidator;

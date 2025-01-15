import ICreateTeamMembershipHistoryRequestDTO from "api/DTOs/teamMembershipHistories/create/ICreateTeamMembershipHistoryRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { date, integer, max, min, object, string } from "superstruct";

const validatorSchema = object({
    dateEffectiveFrom: date(),
    number: min(max(integer(), 11), 1),
    position: string(),
});

function createTeamMembershipHistoryValidator(data: ICreateTeamMembershipHistoryRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default createTeamMembershipHistoryValidator;

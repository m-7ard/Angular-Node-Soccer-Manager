import IUpdateTeamMembershipHistoryRequestDTO from "api/DTOs/teamMembershipHistories/update/IUpdateTeamMembershipHistoryRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { date, integer, max, min, object, string } from "superstruct";

const validatorSchema = object({
    dateEffectiveFrom: date(),
    number: min(max(integer(), 11), 1),
    position: string(),
});

function updateTeamMembershipHistoryValidator(data: IUpdateTeamMembershipHistoryRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default updateTeamMembershipHistoryValidator;

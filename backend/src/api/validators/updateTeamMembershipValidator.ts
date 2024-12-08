import IUpdateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/update/IUpdateTeamMembershipRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { date, integer, max, min, nullable, number, object, string } from "superstruct";

const validatorSchema = object({
    activeFrom: date(),
    activeTo: nullable(date()),
    number: min(max(integer(), 11), 1),
});

function updateTeamMembershipValidator(data: IUpdateTeamMembershipRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default updateTeamMembershipValidator;

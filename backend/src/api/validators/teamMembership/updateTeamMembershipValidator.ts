import IUpdateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/update/IUpdateTeamMembershipRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { date, nullable, object } from "superstruct";

const validatorSchema = object({
    activeFrom: date(),
    activeTo: nullable(date()),
});

function updateTeamMembershipValidator(data: IUpdateTeamMembershipRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default updateTeamMembershipValidator;

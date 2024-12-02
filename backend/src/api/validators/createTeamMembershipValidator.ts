import ICreateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/create/ICreateTeamMembershipRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { date, nullable, object, string } from "superstruct";

const validatorSchema = object({
    playerId: string(),
    activeFrom: date(),
    activeTo: nullable(date()),
})

function createTeamMembershipValidator(data: ICreateTeamMembershipRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default createTeamMembershipValidator;

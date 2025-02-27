import ICreateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/create/ICreateTeamMembershipRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";
import { date, integer, max, min, nullable, object, string } from "superstruct";

const validatorSchema = object({
    playerId: string(),
    activeFrom: date(),
    activeTo: nullable(date()),
    number: min(max(integer(), 11), 1),
    position: string(),
});

function createTeamMembershipValidator(data: ICreateTeamMembershipRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default createTeamMembershipValidator;

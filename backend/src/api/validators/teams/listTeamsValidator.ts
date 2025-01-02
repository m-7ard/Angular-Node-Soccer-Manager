import { max, min, nullable, number, object, string } from "superstruct";
import validateSuperstruct from "api/utils/validateSuperstruct";
import IListTeamsRequestDTO from "api/DTOs/teams/list/IListTeamsRequestDTO";

const validatorSchema = object({
    name: nullable(string()),
    teamMembershipPlayerId: nullable(string()),
    limitBy: nullable(max(min(number(), 0), 100))
});

function listTeamsValidator(data: IListTeamsRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default listTeamsValidator;

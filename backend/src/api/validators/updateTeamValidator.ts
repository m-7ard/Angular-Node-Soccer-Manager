import { date, object, size, string, Struct } from "superstruct";
import validateSuperstruct from "api/utils/validateSuperstruct";
import IUpdateTeamRequestDTO from "api/DTOs/teams/update/IUpdateTeamRequestDTO";

const validatorSchema: Struct<IUpdateTeamRequestDTO> = object({
    name: size(string(), 1, 256),
    dateFounded: date(),
});

function updateTeamValidator(data: IUpdateTeamRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default updateTeamValidator;

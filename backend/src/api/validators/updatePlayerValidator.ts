import { date, object, size, string, Struct } from "superstruct";
import IUpdatePlayerRequestDTO from "api/DTOs/players/update/IUpdatePlayerRequestDTO";
import validateSuperstruct from "api/utils/validateSuperstruct";

const validatorSchema: Struct<IUpdatePlayerRequestDTO> = object({
    name: size(string(), 1, 256),
    activeSince: date()
});

function updatePlayerValidator(data: IUpdatePlayerRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default updatePlayerValidator;
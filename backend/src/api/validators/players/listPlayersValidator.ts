import { max, min, nonempty, nullable, number, object, string } from "superstruct";
import validateSuperstruct from "api/utils/validateSuperstruct";
import IListPlayersRequestDTO from "api/DTOs/players/list/IListPlayersRequestDTO";

const validatorSchema = object({
    name: nullable(nonempty(string())),
    limitBy: nullable(max(min(number(), 0), 100))
});

function listPlayersValidator(data: IListPlayersRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default listPlayersValidator;

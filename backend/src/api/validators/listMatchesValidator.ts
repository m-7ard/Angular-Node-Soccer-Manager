import { date, max, min, nullable, number, object, string } from "superstruct";
import validateSuperstruct from "api/utils/validateSuperstruct";
import IListMatchesRequestDTO from "api/DTOs/matches/list/IListMatchesRequestDTO";

const validatorSchema = object({
    scheduledDate: nullable(date()),
    status: nullable(string()),
    limitBy: nullable(max(min(number(), 0), 100)),
});

function listMatchesValidator(data: IListMatchesRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default listMatchesValidator;

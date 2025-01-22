import { date, max, min, nonempty, nullable, number, object, size, string } from "superstruct";
import validateSuperstruct from "api/utils/validateSuperstruct";
import IListMatchesRequestDTO from "api/DTOs/matches/list/IListMatchesRequestDTO";

const validatorSchema = object({
    scheduledDate: nullable(date()),
    status: nullable(nonempty(string())),
    limitBy: nullable(max(min(number(), 0), 100)),
    teamId: nullable(nonempty(string())),
});

function listMatchesValidator(data: IListMatchesRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default listMatchesValidator;

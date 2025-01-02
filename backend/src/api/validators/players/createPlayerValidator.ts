import { Type } from "@sinclair/typebox";
import validateTypeboxSchema from "../../utils/validateTypeboxSchema";
import ICreatePlayerRequestDTO from "api/DTOs/players/create/ICreatePlayerRequestDTO";

const validatorSchema = Type.Object({
    name: Type.String({
        minLength: 1,
        maxLength: 255
    }),
    activeSince: Type.Date(),
});

function createPlayerValidator(data: ICreatePlayerRequestDTO) {
    return validateTypeboxSchema(validatorSchema, data);
}

export default createPlayerValidator;
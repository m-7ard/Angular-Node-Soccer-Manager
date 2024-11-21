import { Type } from "@sinclair/typebox";
import validateTypeboxSchema from "../utils/validateTypeboxSchema";
import ICreatePlayerRequestDTO from "api/DTOs/players/create/ICreatePlayerRequestDTO";

const validatorSchema = Type.Object({
    name: Type.String({
        minLength: 1,
        maxLength: 255
    }),
    activeSince: Type.Date(),
    number: Type.Number({
        minimum: 1,
        maximum: 11
    }),
    // images: Type.Array(Type.String({ pattern: '.*\.(jpg|jpeg|png)$' }))
});

function createPlayerValidator(data: ICreatePlayerRequestDTO) {
    return validateTypeboxSchema(validatorSchema, data);
}

export default createPlayerValidator;
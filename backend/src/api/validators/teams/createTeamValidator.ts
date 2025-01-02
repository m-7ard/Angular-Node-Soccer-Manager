import { Type } from "@sinclair/typebox";
import ICreateTeamRequestDTO from "../../DTOs/teams/create/ICreateTeamRequestDTO";
import validateTypeboxSchema from "../../utils/validateTypeboxSchema";

const validatorSchema = Type.Object({
    name: Type.String({
        minLength: 1,
        maxLength: 255
    }),
    dateFounded: Type.Date()
});

function createTeamValidator(data: ICreateTeamRequestDTO) {
    return validateTypeboxSchema(validatorSchema, data);
}

export default createTeamValidator;
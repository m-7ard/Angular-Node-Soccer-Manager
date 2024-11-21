import { Type } from "@sinclair/typebox";
import validateTypeboxSchema from "../utils/validateTypeboxSchema";
import ICreateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/create/ICreateTeamMembershipRequestDTO";

const validatorSchema = Type.Object({
    playerId: Type.String(),
    activeFrom: Type.Date(),
    activeTo: Type.Union([Type.Date(), Type.Null()]),
});

function createTeamMembershipValidator(data: ICreateTeamMembershipRequestDTO) {
    return validateTypeboxSchema(validatorSchema, data);
}

export default createTeamMembershipValidator;

import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IValidator from "application/interfaces/IValidator";
import Team from "domain/entities/Team";
import { Result, err, ok } from "neverthrow";

class CanAddTeamMembershipValidator implements IValidator< { team: Team, playerId: string, activeFrom: Date, activeTo: Date | null; number: number }, true> {
    validate(input: { team: Team, playerId: string, activeFrom: Date, activeTo: Date | null; number: number }): Result<true, IApplicationError[]> {
        const { team, playerId, activeFrom, activeTo, number } = input;
        const canAddMembershipResult = team.canAddMember({ playerId: playerId, activeFrom: activeFrom, activeTo: activeTo, number: number });
        if (canAddMembershipResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddMembershipResult.error,
                    code: APPLICATION_VALIDATOR_CODES.CAN_ADD_TEAM_MEMBERSHIP_ERROR,
                    path: [],
                }
            ));
        }

        return ok(true);
    }
}

export default CanAddTeamMembershipValidator;

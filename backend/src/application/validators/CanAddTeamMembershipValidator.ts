import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IValidator from "application/interfaces/IValidator";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import { Result, err, ok } from "neverthrow";

interface Props { team: Team, player: Player, activeFrom: Date, activeTo: Date | null; }

class CanAddTeamMembershipValidator implements IValidator<Props, true> {
    validate(input: Props): Result<true, IApplicationError[]> {
        const { team, player, activeFrom, activeTo } = input;
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

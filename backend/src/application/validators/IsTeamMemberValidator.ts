import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IValidator from "application/interfaces/IValidator";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import { err, ok, Result } from "neverthrow";

class IsTeamMemberValidator implements IValidator<{ team: Team; playerId: string }, TeamMembership> {
    validate(input: { team: Team; playerId: string }): Result<TeamMembership, IApplicationError[]> {
        const { team, playerId } = input;

        const membership = team.findMemberByPlayerId(playerId);
        if (!membership) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Player of id "${playerId}" does not exist on team of id "${team.id}".`,
                    code: APPLICATION_VALIDATOR_CODES.IS_TEAM_MEMBER_ERROR,
                    path: [],
                }),
            );
        }

        return ok(membership);
    }
}

export default IsTeamMemberValidator;

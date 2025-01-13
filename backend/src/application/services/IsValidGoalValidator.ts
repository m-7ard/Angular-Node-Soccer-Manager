import IGoalData from "application/contracts/IGoalData";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IApplicationError from "application/errors/IApplicationError";
import IValidator from "application/interfaces/IValidator";
import Team from "domain/entities/Team";
import { err, ok, Result } from "neverthrow";

class IsValidGoalValidator implements IValidator<IGoalData, true> {
    constructor(
        private readonly homeTeam: Team,
        private readonly awayTeam: Team,
    ) {
        if (homeTeam.id.equals(awayTeam.id)) {
            throw new Error("Home team and away team cannot be the same team.");
        }
    }

    validate(goal: IGoalData): Result<true, IApplicationError[]> {
        if (!goal.teamId.equals(this.homeTeam.id) && !goal.teamId.equals(this.awayTeam.id)) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Goal team id does not match the home team or away team.`,
                    code: APPLICATION_SERVICE_CODES.IS_VALID_GOAL_ERROR,
                    path: [],
                }),
            );
        }

        const awayTeamMembership = this.awayTeam.findActiveMemberByPlayerId(goal.playerId);
        const homeTeamMembership = this.homeTeam.findActiveMemberByPlayerId(goal.playerId);

        if (awayTeamMembership != null && homeTeamMembership != null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Goal player of id "${goal.playerId}" cannot be an active member of both teams.`,
                    code: APPLICATION_SERVICE_CODES.IS_VALID_GOAL_ERROR,
                    path: [],
                }),
            );
        }

        const membership = awayTeamMembership ?? homeTeamMembership;

        if (membership == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Player of id "${goal.playerId}" does not exist on Home Team or Away Team.`,
                    code: APPLICATION_SERVICE_CODES.IS_VALID_GOAL_ERROR,
                    path: [],
                }),
            );
        }

        return ok(true);
    }
}

export default IsValidGoalValidator;

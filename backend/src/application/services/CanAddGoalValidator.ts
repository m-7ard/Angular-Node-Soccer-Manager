import IGoalData from "application/contracts/IGoalData";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IApplicationError from "application/errors/IApplicationError";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IAddGoalService, { IAddGoalServiceFactory } from "application/interfaces/IAddGoalService";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import ITeamValidator from "application/interfaces/ITeamValidator";
import Match from "domain/entities/Match";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import { err, ok, Result } from "neverthrow";

class AddGoalService implements IAddGoalService {
    constructor(
        private readonly match: Match,
        private readonly playerExistsValidator: IPlayerValidator<PlayerId>,
        private readonly teamExistsValidator: ITeamValidator<TeamId>,
    ) {}

    async tryAddGoal(goal: IGoalData): Promise<Result<true, IApplicationError[]>> {
        // Is Match Team
        const isMatchTeam = this.match.isMatchTeam(goal.teamId);
        if (isMatchTeam) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Team of id "${TeamId}" is not a Match Team.`, path: [], code: APPLICATION_ERROR_CODES.StateMismatch }));
        }

        // Goal Team Exists
        const goalTeamExistsResult = await this.teamExistsValidator.validate(goal.teamId);
        if (goalTeamExistsResult.isErr()) {
            return err(goalTeamExistsResult.error);
        }

        const goalTeam = goalTeamExistsResult.value;

        // Goal player Exists
        const playerExistsResult = await this.playerExistsValidator.validate(goal.playerId);
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const goalPlayer = playerExistsResult.value;

        // Can Add Goal
        const canAddMatchGoalResult = this.match.canAddGoal({ dateOccured: goal.dateOccured, team: goalTeam, player: goalPlayer });
        if (canAddMatchGoalResult.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({ message: canAddMatchGoalResult.error, path: [], code: APPLICATION_SERVICE_CODES.CAN_ADD_GOAL_ERROR }));
        }

        if (canAddMatchGoalResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddMatchGoalResult.error,
                    path: [],
                    code: APPLICATION_SERVICE_CODES.CAN_ADD_GOAL_ERROR,
                }),
            );
        }

        this.match.executeAddGoal({ dateOccured: goal.dateOccured, team: goalTeam, player: goalPlayer });
        return ok(true);
    }
}

export class AddGoalServiceFactory implements IAddGoalServiceFactory {
    constructor(
        private readonly playerExistsValidator: IPlayerValidator<PlayerId>,
        private readonly teamExistsValidator: ITeamValidator<TeamId>,
    ) {}

    create(match: Match): IAddGoalService {
        return new AddGoalService(match, this.playerExistsValidator, this.teamExistsValidator);
    }
    
}

export default AddGoalService;

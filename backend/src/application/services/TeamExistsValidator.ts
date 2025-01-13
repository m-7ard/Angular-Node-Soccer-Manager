import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IApplicationError from "application/errors/IApplicationError";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ITeamValidator from "application/interfaces/ITeamValidator";
import Team from "domain/entities/Team";
import TeamId from "domain/valueObjects/Team/TeamId";
import { Result, err, ok } from "neverthrow";

class TeamExistsValidator implements ITeamValidator<TeamId> {
    constructor(private readonly teamRepository: ITeamRepository) {}

    async validate(id: TeamId): Promise<Result<Team, IApplicationError[]>> {
        const team = await this.teamRepository.getByIdAsync(id);

        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Team of id "${id}" does not exist.`,
                    code: APPLICATION_SERVICE_CODES.TEAM_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(team);
    }
}

export default TeamExistsValidator;

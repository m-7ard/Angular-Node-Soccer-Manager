import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ITeamValidator from "application/interfaces/ITeamValidaror";
import Team from "domain/entities/Team";
import TeamId from "domain/valueObjects/Team/TeamId";
import { Result, err, ok } from "neverthrow";

class TeamExistsValidator implements ITeamValidator<TeamId> {
    constructor(private readonly teamRepository: ITeamRepository) {}

    async validate(id: TeamId): Promise<Result<Team, IApplicationError[]>> {
        const team = await this.teamRepository.getByIdAsync(id.value);

        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Team of id "${id.value}" does not exist.`,
                    code: APPLICATION_VALIDATOR_CODES.TEAM_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(team);
    }
}

export default TeamExistsValidator;

import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import ITeamRepository from "application/interfaces/ITeamRepository";
import IValidator from "application/interfaces/IValidator";
import Team from "domain/entities/Team";
import { Result, err, ok } from "neverthrow";

class TeamExistsValidator implements IValidator<{ id: string }, Team> {
    constructor(private readonly teamRepository: ITeamRepository) {}

    async validate(input: { id: string }): Promise<Result<Team, IApplicationError[]>> {
        const team = await this.teamRepository.getByIdAsync(input.id);

        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Team of id "${input.id}" does not exist.`,
                    code: APPLICATION_VALIDATOR_CODES.TEAM_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(team);
    }
}

export default TeamExistsValidator;

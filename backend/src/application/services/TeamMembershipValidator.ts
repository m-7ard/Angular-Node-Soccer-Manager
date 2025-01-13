import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IApplicationError from "application/errors/IApplicationError";
import ITeamMembershipExistsValidator, { ITeamMembershipExistsValidatorFactory } from "application/interfaces/ITeamMembershipExistsValidator";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import { err, ok, Result } from "neverthrow";

class TeamMembershipExistsValidator implements ITeamMembershipExistsValidator<TeamMembershipId> {
    constructor(private readonly team: Team) {}

    validate(id: TeamMembershipId): Result<TeamMembership, IApplicationError[]> {
        const result = this.team.tryFindMemberById(id);
        if (result.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({ message: result.error, path: [], code: APPLICATION_SERVICE_CODES.TEAM_MEMBERSHIP_EXISTS_ERROR }));
        }

        return ok(result.value);
    }
}

export class TeamMembershipExistsValidatorFactory implements ITeamMembershipExistsValidatorFactory<TeamMembershipId> {
    create(team: Team): ITeamMembershipExistsValidator<TeamMembershipId> {
        return new TeamMembershipExistsValidator(team);
    };
}

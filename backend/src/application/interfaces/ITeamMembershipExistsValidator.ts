import IApplicationError from "application/errors/IApplicationError";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import { Result } from "neverthrow";

interface ITeamMembershipExistsValidator<T> {
    validate(input: T): Result<TeamMembership, IApplicationError[]>;
}

export interface ITeamMembershipExistsValidatorFactory<T> {
    create: (team: Team) => ITeamMembershipExistsValidator<T>
}

export default ITeamMembershipExistsValidator;
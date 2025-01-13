import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import { Result } from "neverthrow";
import ITeamValidator from "./ITeamValidaror";

interface ITeamMembershipExistsValidator<T> {
    validate(input: T): Promise<Result<TeamMembership, IApplicationError[]>>;
}

export interface ITeamMembershipExistsValidatorFactory<T> {
    create: (team: Team) => ITeamValidator<T>
}

export default ITeamMembershipExistsValidator;
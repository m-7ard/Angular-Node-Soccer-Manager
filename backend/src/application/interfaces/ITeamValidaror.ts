import Team from "domain/entities/Team";
import { Result } from "neverthrow";

interface ITeamValidator<T> {
    validate(input: T): Result<Team, IApplicationError[]>;
}

export default ITeamValidator;
import IApplicationError from "application/errors/IApplicationError";
import Team from "domain/entities/Team";
import { Result } from "neverthrow";

interface ITeamValidator<T> {
    validate(input: T): Promise<Result<Team, IApplicationError[]>>;
}

export default ITeamValidator;
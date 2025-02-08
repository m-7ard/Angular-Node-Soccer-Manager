import IApplicationError from "application/errors/IApplicationError";
import Team from "domain/entities/Team";
import IValueObject from "domain/valueObjects/IValueObject";
import { Result } from "neverthrow";

interface ITeamValidator<T extends IValueObject> {
    validate(input: T): Promise<Result<Team, IApplicationError[]>>;
}

export default ITeamValidator;
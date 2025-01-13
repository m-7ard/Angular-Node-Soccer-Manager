import IApplicationError from "application/errors/IApplicationError";
import Player from "domain/entities/Player";
import { Result } from "neverthrow";

interface IPlayerValidator<T> {
    validate(input: T): Promise<Result<Player, IApplicationError[]>>;
}

export default IPlayerValidator;
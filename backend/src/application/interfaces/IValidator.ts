import IApplicationError from "application/errors/IApplicationError";
import { Result } from "neverthrow";

interface IValidator<InputType, SuccessType> {
    validate(input: InputType): Result<SuccessType, IApplicationError[]> | Promise<Result<SuccessType, IApplicationError[]>>;
}

export default IValidator;

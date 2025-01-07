import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IUserRepository from "application/interfaces/IUserRepository";
import IValidator from "application/interfaces/IValidator";
import User from "domain/entities/User";
import { err, ok, Result } from "neverthrow";

class UserExistsValidator implements IValidator<{ email: string }, User> {
    constructor(private readonly userRepository: IUserRepository) {}

    async validate(input: { email: string }): Promise<Result<User, IApplicationError[]>> {
        const match = await this.userRepository.getByEmailAsync(input.email);

        if (match == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `User of email "${input.email}" does not exist.`,
                    code: APPLICATION_VALIDATOR_CODES.USER_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(match);
    }
}

export default UserExistsValidator;

import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUserRepository from "../../interfaces/IUserRepository";
import UserFactory from "domain/domainFactories/UserFactory";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";

export type RegisterUserCommandResult = ICommandResult<IApplicationError[]>;

export class RegisterUserCommand implements ICommand<RegisterUserCommandResult> {
    __returnType: RegisterUserCommandResult = null!;

    constructor({ id, name, password, email }: { id: string; name: string; password: string; email: string }) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    public id: string;
    public name: string;
    public password: string;
    public email: string;
}

export default class RegisterUserCommandHandler implements IRequestHandler<RegisterUserCommand, RegisterUserCommandResult> {
    private readonly _userRepository: IUserRepository;
    private readonly _passwordHasher: IPasswordHasher;

    constructor(props: { userRepository: IUserRepository; passwordHasher: IPasswordHasher }) {
        this._userRepository = props.userRepository;
        this._passwordHasher = props.passwordHasher;
    }

    async handle(command: RegisterUserCommand): Promise<RegisterUserCommandResult> {
        const existingUser = await this._userRepository.getByEmailAsync(command.email);
        if (existingUser != null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `User of email "${command.email} already exists.".`,
                    path: ["_"],
                    code: VALIDATION_ERROR_CODES.ModelAlreadyExists,
                }),
            );
        }

        const hashed_password = await this._passwordHasher.hashPassword(command.password);
        const user = UserFactory.CreateNew({
            id: command.id,
            name: command.name,
            email: command.email,
            hashedPassword: hashed_password,
            isAdmin: false,
        });

        await this._userRepository.createAsync(user);
        return ok(undefined);
    }
}

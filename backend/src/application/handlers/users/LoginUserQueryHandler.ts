import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IUserRepository from "application/interfaces/IUserRepository";
import IJwtTokenService from "application/interfaces/JwtTokenService";
import IQuery, { IQueryResult } from "../IQuery";
import { IRequestHandler } from "../IRequestHandler";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import { err, ok } from "neverthrow";
import { JWT_ROLES } from "application/other/jwt-payload";

export type LoginUserQueryResult = IQueryResult<{ jwtToken: string }, IApplicationError[]>;

export class LoginUserQuery implements IQuery<LoginUserQueryResult> {
    __returnType: LoginUserQueryResult = null!;

    constructor(props: { password: string; email: string }) {
        this.password = props.password;
        this.email = props.email;
    }

    public password: string;
    public email: string;
}

export default class LoginUserQueryHandler implements IRequestHandler<LoginUserQuery, LoginUserQueryResult> {
    private readonly _userRepository: IUserRepository;
    private readonly _jwtTokenService: IJwtTokenService;
    private readonly _passwordHasher: IPasswordHasher;

    constructor(props: { userRepository: IUserRepository; jwtTokenService: IJwtTokenService; passwordHasher: IPasswordHasher }) {
        this._userRepository = props.userRepository;
        this._jwtTokenService = props.jwtTokenService;
        this._passwordHasher = props.passwordHasher;
    }

    async handle(query: LoginUserQuery): Promise<LoginUserQueryResult> {
        const user = await this._userRepository.getByEmailAsync(query.email);
        if (user == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Email or password is incorrect.`,
                    path: ["_"],
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                }),
            );
        }

        const isValid = await this._passwordHasher.verifyPassword(query.password, user.hashedPassword);
        if (!isValid) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Email or password is incorrect.`,
                    path: ["_"],
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                }),
            );
        }

        const jwtToken = await this._jwtTokenService.generateToken({
            email: user.email,
            role: user.isAdmin ? JWT_ROLES.ADMIN : JWT_ROLES.CLIENT,
        });

        return ok({ jwtToken: jwtToken });
    }
}

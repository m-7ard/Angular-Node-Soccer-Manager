import IApiModelService from "api/interfaces/IApiModelService";
import IDatabaseService from "api/interfaces/IDatabaseService";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import IMatchRepository from "application/interfaces/IMatchRepository";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import IUserRepository from "application/interfaces/IUserRepository";
import IJwtTokenService from "application/interfaces/JwtTokenService";

type TokenType<T> = T extends { __service: infer S } ? S : never;

type TokenMap = typeof DI_TOKENS;
type TokenKeys = keyof TokenMap;
type TokenValues = TokenMap[TokenKeys];

type Factory<T = unknown> = (container: DIContainer) => T;

type Registration<T = unknown> = { type: "instance"; value: T } | { type: "factory"; value: Factory<T> };

const makeToken = <Service>(literal: string) => literal as string & { __service: Service };

export const DI_TOKENS = {
    DATABASE: makeToken<IDatabaseService>("DATABASE"),
    REQUEST_DISPATCHER: makeToken<IRequestDispatcher>("REQUEST_DISPATCHER"),
    PASSWORD_HASHER: makeToken<IPasswordHasher>("PASSWORD_HASHER"),
    JWT_TOKEN_SERVICE: makeToken<IJwtTokenService>("JWT_TOKEN_SERVICE"),
    TEAM_REPOSITORY: makeToken<ITeamRepository>("TEAM_REPOSITORY"),
    PLAYER_REPOSITORY: makeToken<IPlayerRepository>("PLAYER_REPOSITORY"),
    USER_REPOSITORY: makeToken<IUserRepository>("USER_REPOSITORY"),
    MATCH_REPOSITORY: makeToken<IMatchRepository>("MATCH_REPOSITORY"),
    API_MODEL_SERVICE: makeToken<IApiModelService>("API_MODEL_SERVICE"),
} as const;

export class DIContainer {
    private dependencies = new Map<string, Registration<unknown>>();

    register<K extends TokenValues>(token: K, instance: TokenType<K>): void {
        this.dependencies.set(token as string, {
            type: "instance",
            value: instance,
        });
    }

    registerFactory<K extends TokenValues>(token: K, factory: Factory<TokenType<K>>): void {
        this.dependencies.set(token as string, {
            type: "factory",
            value: factory,
        });
    }

    // registerSingleton<K extends TokenValues>(token: K, factory: Factory<TokenType<K>>): void {
    //     let instance: TokenType<K> | undefined;
    //     this.dependencies.set(token as string, {
    //         type: "factory",
    //         value: (container: DIContainer) => {
    //             if (!instance) {
    //                 instance = factory(container);
    //             }
    //             return instance;
    //         },
    //     });
    // }

    resolve<K extends TokenValues>(token: K): TokenType<K> {
        const registration = this.dependencies.get(token as string);

        if (!registration) {
            throw new Error(`Dependency not registered: ${token}`);
        }

        switch (registration.type) {
            case "instance":
                return registration.value as TokenType<K>;
            case "factory":
                return registration.value(this) as TokenType<K>;
            default:
                throw new Error(`Missing registration for: ${token}`);
        }
    }
}

const diContainer = new DIContainer();

export default diContainer;

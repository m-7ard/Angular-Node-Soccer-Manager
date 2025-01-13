import IApiModelService from "api/interfaces/IApiModelService";
import IDatabaseService from "api/interfaces/IDatabaseService";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { IAddGoalServiceFactory } from "application/interfaces/IAddGoalService";
import IMatchRepository from "application/interfaces/IMatchRepository";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import { ITeamMembershipExistsValidatorFactory } from "application/interfaces/ITeamMembershipExistsValidator";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ITeamValidator from "application/interfaces/ITeamValidator";
import IUserRepository from "application/interfaces/IUserRepository";
import IJwtTokenService from "application/interfaces/JwtTokenService";
import MatchExistsValidator from "application/services/MatchExistsValidator";
import UserExistsValidator from "application/services/UserExistsValidator";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";

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

    ADD_GOAL_SERIVICE_FACTORY: makeToken<IAddGoalServiceFactory>("ADD_GOAL_SERIVICE_FACTORY"),
    
    PLAYER_EXISTS_VALIDATOR: makeToken<IPlayerValidator<PlayerId>>("PLAYER_EXISTS_VALIDATOR"),
    TEAM_EXISTS_VALIDATOR: makeToken<ITeamValidator<TeamId>>("TEAM_EXISTS_VALIDATOR"),
    USER_EXISTS_VALIDATOR: makeToken<UserExistsValidator>("USER_EXISTS_VALIDATOR"),
    MATCH_EXISTS_VALIDATOR: makeToken<MatchExistsValidator>("MATCH_EXISTS_VALIDATOR"),
    TEAM_MEMBERSHIP_EXISTS_VALIDATOR_FACTORY: makeToken<ITeamMembershipExistsValidatorFactory<TeamMembershipId>>("TEAM_MEMBERSHIP_EXISTS_VALIDATOR_FACTORY"),
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

import RequestDispatcher from "application/handlers/RequestDispatcher";
import CreateTeamCommandHandler, { CreateTeamCommand } from "application/handlers/teams/CreateTeamCommandHandler";
import diContainer, { DI_TOKENS } from "./diContainer";
import CreatePlayerCommandHandler, { CreatePlayerCommand } from "application/handlers/players/CreatePlayerCommandHandler";
import CreateTeamMembershipCommandHandler, { CreateTeamMembershipCommand } from "application/handlers/team_memberships/CreateTeamMembershipCommandHandler";
import ListTeamsQueryHandler, { ListTeamsQuery } from "application/handlers/teams/ListTeamsQueryHandler";
import ListPlayersQueryHandler, { ListPlayersQuery } from "application/handlers/players/ListPlayersQueryHandler";
import ReadPlayerQueryHandler, { ReadPlayerQuery } from "application/handlers/players/ReadPlayerQueryHandler";
import ReadTeamQueryHandler, { ReadTeamQuery } from "application/handlers/teams/ReadTeamQueryHandler";
import UpdatePlayerCommandHandler, { UpdatePlayerCommand } from "application/handlers/players/UpdatePlayerCommandHandler";
import DeletePlayerCommandHandler, { DeletePlayerCommand } from "application/handlers/players/DeletePlayerCommandHandler";
import UpdateTeamCommandHandler, { UpdateTeamCommand } from "application/handlers/teams/UpdateTeamCommandHandler";
import DeleteTeamCommandHandler, { DeleteTeamCommand } from "application/handlers/teams/DeleteTeamCommandHandler";
import DeleteTeamMembershipCommandHandler, { DeleteTeamMembershipCommand } from "application/handlers/team_memberships/DeleteTeamMembershipCommandHandler";
import UpdateTeamMembershipCommandHandler, { UpdateTeamMembershipCommand } from "application/handlers/team_memberships/UpdateTeamMembershipCommandHandler";
import ReadTeamMembershipQueryHandler, { ReadTeamMembershipQuery } from "application/handlers/team_memberships/ReadTeamMembershipQueryHandler";
import RegisterUserCommandHandler, { RegisterUserCommand } from "application/handlers/users/RegisterUserCommandHandler";
import LoginUserQueryHandler, { LoginUserQuery } from "application/handlers/users/LoginUserQueryHandler";
import CurrentUserQueryHandler, { CurrentUserQuery } from "application/handlers/users/CurrentUserQueryHandler";
import CreateMatchCommandHandler, { CreateMatchCommand } from "application/handlers/matches/CreateMatchCommandHandler";
import ReadMatchQueryHandler, { ReadMatchQuery } from "application/handlers/matches/ReadMatchQueryHandler";
import ListMatchesQueryHandler, { ListMatchesQuery } from "application/handlers/matches/ListMatchesQueryHandler";
import MarkMatchInProgressCommandHandler, { MarkMatchInProgressCommand } from "application/handlers/matches/MarkMatchInProgressCommandHandler";
import MarkMatchCompletedCommandHandler, { MarkMatchCompletedCommand } from "application/handlers/matches/MarkMatchCompletedCommandHandler";
import MarkMatchCancelledCommandHandler, { MarkMatchCancelledCommand } from "application/handlers/matches/MarkMatchCancelledCommandHandler";
import ScheduleMatchCommandHandler, { ScheduleMatchCommand } from "application/handlers/matches/ScheduleMatchCommandHandler";
import RecordGoalCommandHandler, { RecordGoalCommand } from "application/handlers/matchEvents/RecordGoalCommandHandler";
import CreateTeamMembershipHistoryCommandHandler, { CreateTeamMembershipHistoryCommand } from "application/handlers/team_membership_histories/CreateTeamMembershipHistoryCommandHandler";
import UpdateTeamMembershipHistoryCommandHandler, { UpdateTeamMembershipHistoryCommand } from "application/handlers/team_membership_histories/UpdateTeamMembershipHistoryCommandHandler";
import ReadFullPlayerQueryHandler, { ReadFullPlayerQuery } from "application/handlers/players/ReadFullPlayerQueryHandler";
import DeleteTeamMembershipHistoryCommandHandler, { DeleteTeamMembershipHistoryCommand } from "application/handlers/team_membership_histories/DeleteTeamMembershipHistoryCommandHandler";
import DeleteMatchCommandHandler, { DeleteMatchCommand } from "application/handlers/matches/DeleteMatchCommandHandler";

function createRequestDispatcher() {
    const requestDispatcher = new RequestDispatcher();
    const teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
    const playerRepository = diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY);
    const userRepository = diContainer.resolve(DI_TOKENS.USER_REPOSITORY);
    const matchRepository = diContainer.resolve(DI_TOKENS.MATCH_REPOSITORY);
    const passwordHasher = diContainer.resolve(DI_TOKENS.PASSWORD_HASHER);
    const jwtTokenService = diContainer.resolve(DI_TOKENS.JWT_TOKEN_SERVICE);

    const playerExistsValidator = diContainer.resolve(DI_TOKENS.PLAYER_EXISTS_VALIDATOR);
    const teamExistsValidator = diContainer.resolve(DI_TOKENS.TEAM_EXISTS_VALIDATOR);
    const userExistsValidator = diContainer.resolve(DI_TOKENS.USER_EXISTS_VALIDATOR);
    const matchExistsValidator = diContainer.resolve(DI_TOKENS.MATCH_EXISTS_VALIDATOR);
    const teamMembershipExistsValidatorFactory = diContainer.resolve(DI_TOKENS.TEAM_MEMBERSHIP_EXISTS_VALIDATOR_FACTORY);
    const addGoalServiceFactory = diContainer.resolve(DI_TOKENS.ADD_GOAL_SERIVICE_FACTORY);

    // Players
    requestDispatcher.registerHandler(CreatePlayerCommand, new CreatePlayerCommandHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(ListPlayersQuery, new ListPlayersQueryHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(ReadPlayerQuery, new ReadPlayerQueryHandler({ playerExistsValidator: playerExistsValidator }));
    requestDispatcher.registerHandler(UpdatePlayerCommand, new UpdatePlayerCommandHandler({ playerRepository: playerRepository, playerExistsValidator: playerExistsValidator }));
    requestDispatcher.registerHandler(
        DeletePlayerCommand,
        new DeletePlayerCommandHandler({ playerRepository: playerRepository, teamRepository: teamRepository, playerExistsValidator: playerExistsValidator }),
    );
    requestDispatcher.registerHandler(ReadFullPlayerQuery, new ReadFullPlayerQueryHandler({ playerExistsValidator: playerExistsValidator, teamRepository: teamRepository }));

    // Teams
    requestDispatcher.registerHandler(CreateTeamCommand, new CreateTeamCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ListTeamsQuery, new ListTeamsQueryHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ReadTeamQuery, new ReadTeamQueryHandler({ teamExistsValidator: teamExistsValidator }));
    requestDispatcher.registerHandler(UpdateTeamCommand, new UpdateTeamCommandHandler({ teamRepository: teamRepository, teamExistsValidator: teamExistsValidator }));
    requestDispatcher.registerHandler(DeleteTeamCommand, new DeleteTeamCommandHandler({ teamRepository: teamRepository, teamExistsValidator: teamExistsValidator, matchRepository: matchRepository }));

    // Team Memberships
    requestDispatcher.registerHandler(
        CreateTeamMembershipCommand,
        new CreateTeamMembershipCommandHandler({ teamRepository: teamRepository, playerExistsValidator: playerExistsValidator, teamExistsValidator: teamExistsValidator }),
    );
    requestDispatcher.registerHandler(DeleteTeamMembershipCommand, new DeleteTeamMembershipCommandHandler({ teamRepository: teamRepository, teamExistsValidator: teamExistsValidator }));
    requestDispatcher.registerHandler(
        UpdateTeamMembershipCommand,
        new UpdateTeamMembershipCommandHandler({
            teamRepository: teamRepository,
            teamExistsValidator: teamExistsValidator,
            playerExistsValidator: playerExistsValidator,
            teamMembershipExistsValidatorFactory: teamMembershipExistsValidatorFactory,
        }),
    );
    requestDispatcher.registerHandler(
        ReadTeamMembershipQuery,
        new ReadTeamMembershipQueryHandler({ teamExistsValidator: teamExistsValidator, teamMembershipValidatorFactory: teamMembershipExistsValidatorFactory }),
    );

    // Team Membership Histories
    requestDispatcher.registerHandler(CreateTeamMembershipHistoryCommand, new CreateTeamMembershipHistoryCommandHandler({ teamExistsValidator: teamExistsValidator, teamRepository: teamRepository }));
    requestDispatcher.registerHandler(UpdateTeamMembershipHistoryCommand, new UpdateTeamMembershipHistoryCommandHandler({ teamExistsValidator: teamExistsValidator, teamRepository: teamRepository }));
    requestDispatcher.registerHandler(DeleteTeamMembershipHistoryCommand, new DeleteTeamMembershipHistoryCommandHandler({ teamExistsValidator: teamExistsValidator, teamRepository: teamRepository }));

    // Users
    requestDispatcher.registerHandler(
        RegisterUserCommand,
        new RegisterUserCommandHandler({ passwordHasher: passwordHasher, userRepository: userRepository, userExistsValidator: userExistsValidator }),
    );
    requestDispatcher.registerHandler(LoginUserQuery, new LoginUserQueryHandler({ passwordHasher: passwordHasher, jwtTokenService: jwtTokenService, userExistsValidator: userExistsValidator }));
    requestDispatcher.registerHandler(CurrentUserQuery, new CurrentUserQueryHandler({ userRepository: userRepository, jwtTokenService: jwtTokenService }));

    // Matches
    requestDispatcher.registerHandler(
        CreateMatchCommand,
        new CreateMatchCommandHandler({ matchRepository: matchRepository, teamExistsValidator: teamExistsValidator, addGoalServiceFactory: addGoalServiceFactory }),
    );
    requestDispatcher.registerHandler(ReadMatchQuery, new ReadMatchQueryHandler({ matchExistsValidator: matchExistsValidator }));
    requestDispatcher.registerHandler(ListMatchesQuery, new ListMatchesQueryHandler({ matchRepository: matchRepository }));
    requestDispatcher.registerHandler(MarkMatchInProgressCommand, new MarkMatchInProgressCommandHandler({ matchRepository: matchRepository, matchExistsValidator: matchExistsValidator }));
    requestDispatcher.registerHandler(MarkMatchCompletedCommand, new MarkMatchCompletedCommandHandler({ matchRepository: matchRepository, matchExistsValidator: matchExistsValidator }));
    requestDispatcher.registerHandler(MarkMatchCancelledCommand, new MarkMatchCancelledCommandHandler({ matchRepository: matchRepository, matchExistsValidator: matchExistsValidator }));
    requestDispatcher.registerHandler(ScheduleMatchCommand, new ScheduleMatchCommandHandler({ matchRepository: matchRepository, teamExistsValidator: teamExistsValidator }));
    requestDispatcher.registerHandler(
        RecordGoalCommand,
        new RecordGoalCommandHandler({ matchRepository: matchRepository, matchExistsValidator: matchExistsValidator, addGoalServiceFactory: addGoalServiceFactory }),
    );
    requestDispatcher.registerHandler(DeleteMatchCommand, new DeleteMatchCommandHandler({ matchRepository: matchRepository, matchExistsValidator: matchExistsValidator }));

    return requestDispatcher;
}

export default createRequestDispatcher;

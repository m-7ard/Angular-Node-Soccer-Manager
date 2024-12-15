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

function createRequestDispatcher() {
    const requestDispatcher = new RequestDispatcher();
    const teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
    const playerRepository = diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY);
    const userRepository = diContainer.resolve(DI_TOKENS.USER_REPOSITORY);
    const passwordHasher = diContainer.resolve(DI_TOKENS.PASSWORD_HASHER);
    const jwtTokenService = diContainer.resolve(DI_TOKENS.JWT_TOKEN_SERVICE);

    // Players
    requestDispatcher.registerHandler(CreatePlayerCommand, new CreatePlayerCommandHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(ListPlayersQuery, new ListPlayersQueryHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(ReadPlayerQuery, new ReadPlayerQueryHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(UpdatePlayerCommand, new UpdatePlayerCommandHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(DeletePlayerCommand, new DeletePlayerCommandHandler({ playerRepository: playerRepository, teamRepository: teamRepository }));

    // Teams
    requestDispatcher.registerHandler(CreateTeamCommand, new CreateTeamCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ListTeamsQuery, new ListTeamsQueryHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ReadTeamQuery, new ReadTeamQueryHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(UpdateTeamCommand, new UpdateTeamCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(DeleteTeamCommand, new DeleteTeamCommandHandler({ teamRepository: teamRepository }));

    // Team Memberships
    requestDispatcher.registerHandler(CreateTeamMembershipCommand, new CreateTeamMembershipCommandHandler({ playerRepository: playerRepository, teamRepository: teamRepository }));
    requestDispatcher.registerHandler(DeleteTeamMembershipCommand, new DeleteTeamMembershipCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(UpdateTeamMembershipCommand, new UpdateTeamMembershipCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ReadTeamMembershipQuery, new ReadTeamMembershipQueryHandler({ teamRepository: teamRepository }));

    // Users
    requestDispatcher.registerHandler(RegisterUserCommand, new RegisterUserCommandHandler({ passwordHasher: passwordHasher, userRepository: userRepository }));
    requestDispatcher.registerHandler(LoginUserQuery, new LoginUserQueryHandler({ passwordHasher: passwordHasher, userRepository: userRepository, jwtTokenService: jwtTokenService }));
    requestDispatcher.registerHandler(CurrentUserQuery, new CurrentUserQueryHandler({ userRepository: userRepository, jwtTokenService: jwtTokenService }));

    return requestDispatcher;
}

export default createRequestDispatcher;

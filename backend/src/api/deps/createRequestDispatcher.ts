import RequestDispatcher from "application/handlers/RequestDispatcher";
import CreateTeamCommandHandler, { CreateTeamCommand } from "application/handlers/teams/CreateTeamCommandHandler";
import diContainer, { DI_TOKENS } from "./diContainer";
import CreatePlayerCommandHandler, { CreatePlayerCommand } from "application/handlers/players/CreatePlayerCommandHandler";
import CreateTeamMembershipCommandHandler, { CreateTeamMembershipCommand } from "application/handlers/team_memberships/CreateTeamMembershipCommandHandler";
import ListTeamsQueryHandler, { ListTeamsQuery } from "application/handlers/teams/ListTeamsQueryHandler";
import ListPlayersQueryHandler, { ListPlayersQuery } from "application/handlers/players/ListPlayersCommandHandler";

function createRequestDispatcher() {
    const requestDispatcher = new RequestDispatcher();
    const teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
    const playerRepository = diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY);

    requestDispatcher.registerHandler(CreateTeamCommand, new CreateTeamCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(CreatePlayerCommand, new CreatePlayerCommandHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(CreateTeamMembershipCommand, new CreateTeamMembershipCommandHandler({ playerRepository: playerRepository, teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ListTeamsQuery, new ListTeamsQueryHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ListPlayersQuery, new ListPlayersQueryHandler({ playerRepository: playerRepository }));

    return requestDispatcher;
}

export default createRequestDispatcher;

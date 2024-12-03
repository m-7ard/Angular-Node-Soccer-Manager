import RequestDispatcher from "application/handlers/RequestDispatcher";
import CreateTeamCommandHandler, { CreateTeamCommand } from "application/handlers/teams/CreateTeamCommandHandler";
import diContainer, { DI_TOKENS } from "./diContainer";
import CreatePlayerCommandHandler, { CreatePlayerCommand } from "application/handlers/players/CreatePlayerCommandHandler";
import CreateTeamMembershipCommandHandler, { CreateTeamMembershipCommand } from "application/handlers/team_memberships/CreateTeamMembershipCommandHandler";
import ListTeamsQueryHandler, { ListTeamsQuery } from "application/handlers/teams/ListTeamsQueryHandler";
import ListPlayersQueryHandler, { ListPlayersQuery } from "application/handlers/players/ListPlayersQueryHandler";
import ReadPlayersQueryHandler, { ReadPlayersQuery } from "application/handlers/players/ReadPlayerQueryHandler";
import ReadTeamQueryHandler, { ReadTeamQuery } from "application/handlers/teams/ReadTeamQueryHandler";
import UpdatePlayerCommandHandler, { UpdatePlayerCommand } from "application/handlers/players/UpdatePlayerCommandHandler";
import DeletePlayerCommandHandler, { DeletePlayerCommand } from "application/handlers/players/DeletePlayerCommandHandler";
import UpdateTeamCommandHandler, { UpdateTeamCommand } from "application/handlers/teams/UpdateTeamCommandHandler";
import DeleteTeamCommandHandler, { DeleteTeamCommand } from "application/handlers/teams/DeleteTeamCommandHandler";

function createRequestDispatcher() {
    const requestDispatcher = new RequestDispatcher();
    const teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
    const playerRepository = diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY);

    // Players
    requestDispatcher.registerHandler(CreatePlayerCommand, new CreatePlayerCommandHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(ListPlayersQuery, new ListPlayersQueryHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(ReadPlayersQuery, new ReadPlayersQueryHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(UpdatePlayerCommand, new UpdatePlayerCommandHandler({ playerRepository: playerRepository }));
    requestDispatcher.registerHandler(DeletePlayerCommand, new DeletePlayerCommandHandler({ playerRepository: playerRepository }));

    // Teams
    requestDispatcher.registerHandler(CreateTeamCommand, new CreateTeamCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(CreateTeamMembershipCommand, new CreateTeamMembershipCommandHandler({ playerRepository: playerRepository, teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ListTeamsQuery, new ListTeamsQueryHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(ReadTeamQuery, new ReadTeamQueryHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(UpdateTeamCommand, new UpdateTeamCommandHandler({ teamRepository: teamRepository }));
    requestDispatcher.registerHandler(DeleteTeamCommand, new DeleteTeamCommandHandler({ teamRepository: teamRepository }));

    return requestDispatcher;
}

export default createRequestDispatcher;

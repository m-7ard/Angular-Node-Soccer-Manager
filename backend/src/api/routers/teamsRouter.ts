import { Router } from "express";
import CreateTeamAction from "../actions/teams/CreateTeamAction";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import CreateTeamMembershipAction from "api/actions/team_memberships/CreateTeamMembershipAction";
import ListTeamsAction from "api/actions/teams/ListTeamsAction";
import ListTeamPlayersAction from "api/actions/teams/ListTeamPlayersAction";

const teamsRouter = Router();

registerAction({
    router: teamsRouter,
    path: "/",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ListTeamsAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/create",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreateTeamAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/create-membership",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreateTeamMembershipAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/players",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ListTeamPlayersAction(requestDispatcher);
    },
});

export default teamsRouter;

import { Router } from "express";
import CreateTeamAction from "../actions/teams/CreateTeamAction";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import CreateTeamMembershipAction from "api/actions/team_memberships/CreateTeamMembershipAction";
import ListTeamsAction from "api/actions/teams/ListTeamsAction";
import ListTeamPlayersAction from "api/actions/teams/ListTeamPlayersAction";
import UpdateTeamAction from "api/actions/teams/UpdateTeamAction";
import DeleteTeamAction from "api/actions/teams/DeleteTeamAction";
import ReadTeamAction from "api/actions/teams/ReadTeamAction";
import DeleteTeamMembershipAction from "api/actions/team_memberships/DeleteTeamMembershipAction";
import UpdateTeamMembershipAction from "api/actions/team_memberships/UpdateTeamMembershipAction";
import ReadTeamPlayerAction from "api/actions/teams/ReadTeamPlayerAction";
import userIsAuthenticatedGuard from "api/guards/userIsAuthenticatedGuard";
import CreateTeamMembershipHistoryAction from "api/actions/team_membership_histories/CreateTeamMembershipHistoryAction";
import UpdateTeamMembershipHistoryAction from "api/actions/team_membership_histories/UpdateTeamMembershipHistoryAction";
import ListTeamMembershipHistoriesAction from "api/actions/team_memberships/ListTeamMembershipHistories";
import DeleteTeamMembershipHistoryAction from "api/actions/team_membership_histories/DeleteTeamMembershipHistoryAction";

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
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreateTeamAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/create-membership",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
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
        const apiModelService = diContainer.resolve(DI_TOKENS.API_MODEL_SERVICE);
        return new ListTeamPlayersAction(requestDispatcher, apiModelService);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/update",
    method: "PUT",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new UpdateTeamAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/delete",
    method: "DELETE",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new DeleteTeamAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        const apiModelService = diContainer.resolve(DI_TOKENS.API_MODEL_SERVICE);
        return new ReadTeamAction(requestDispatcher, apiModelService);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/delete-membership/:teamMembershipId",
    method: "DELETE",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new DeleteTeamMembershipAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/memberships/:teamMembershipId/update",
    method: "PUT",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new UpdateTeamMembershipAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/memberships/:teamMembershipId",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        const apiModelService = diContainer.resolve(DI_TOKENS.API_MODEL_SERVICE);
        return new ReadTeamPlayerAction(requestDispatcher, apiModelService);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/memberships/:teamMembershipId/histories/create",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreateTeamMembershipHistoryAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/memberships/:teamMembershipId/histories/:teamMembershipHistoryId/update",
    method: "PUT",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new UpdateTeamMembershipHistoryAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/memberships/:teamMembershipId/histories/:teamMembershipHistoryId/delete",
    method: "DELETE",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new DeleteTeamMembershipHistoryAction(requestDispatcher);
    },
});

registerAction({
    router: teamsRouter,
    path: "/:teamId/memberships/:teamMembershipId/histories/",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        const apiModelService = diContainer.resolve(DI_TOKENS.API_MODEL_SERVICE);
        return new ListTeamMembershipHistoriesAction(requestDispatcher, apiModelService);
    },
});

export default teamsRouter;

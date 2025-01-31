import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import userIsAuthenticatedGuard from "api/guards/userIsAuthenticatedGuard";
import CreateMatchAction from "api/actions/matches/CreateMatchAction";
import ReadMatchAction from "api/actions/matches/ReadMatchAction";
import ListMatchesAction from "api/actions/matches/ListMatchesAction";
import MarkMatchInProgressAction from "api/actions/matches/MarkMatchInProgressAction";
import MarkMatchCompletedAction from "api/actions/matches/MarkMatchCompletedAction";
import MarkMatchCancelledAction from "api/actions/matches/MarkMatchCancelledAction";
import ScheduleMatchAction from "api/actions/matches/ScheduleMatchAction";
import RecordGoalAction from "api/actions/matches/RecordGoalAction";
import DeleteMatchAction from "api/actions/matches/DeleteMatchAction";

const matchesRouter = Router();

registerAction({
    router: matchesRouter,
    path: "/create",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreateMatchAction(requestDispatcher);
    },
});

registerAction({
    router: matchesRouter,
    path: "/:matchId",
    method: "GET",
    guards: [],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        const apiModelService = diContainer.resolve(DI_TOKENS.API_MODEL_SERVICE);
        return new ReadMatchAction(requestDispatcher, apiModelService);
    },
});

registerAction({
    router: matchesRouter,
    path: "/",
    method: "GET",
    guards: [],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        const apiModelService = diContainer.resolve(DI_TOKENS.API_MODEL_SERVICE);
        return new ListMatchesAction(requestDispatcher, apiModelService);
    },
});

registerAction({
    router: matchesRouter,
    path: "/:matchId/mark_in_progress",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new MarkMatchInProgressAction(requestDispatcher);
    },
});

registerAction({
    router: matchesRouter,
    path: "/:matchId/mark_completed",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new MarkMatchCompletedAction(requestDispatcher);
    },
});

registerAction({
    router: matchesRouter,
    path: "/:matchId/mark_cancelled",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new MarkMatchCancelledAction(requestDispatcher);
    },
});

registerAction({
    router: matchesRouter,
    path: "/schedule",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ScheduleMatchAction(requestDispatcher);
    },
});

registerAction({
    router: matchesRouter,
    path: "/:matchId/record_goal",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new RecordGoalAction(requestDispatcher);
    },
});

registerAction({
    router: matchesRouter,
    path: "/:matchId/delete",
    method: "DELETE",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new DeleteMatchAction(requestDispatcher);
    },
});

export default matchesRouter;

import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import userIsAuthenticatedGuard from "api/guards/userIsAuthenticatedGuard";
import CreateMatchAction from "api/actions/matches/CreateMatchAction";
import ReadMatchAction from "api/actions/matches/ReadMatchAction";
import ListMatchesAction from "api/actions/matches/ListMatchAction";
import MarkMatchInProgressAction from "api/actions/matches/MarkMatchInProgressAction";

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
        return new ReadMatchAction(requestDispatcher);
    },
});

registerAction({
    router: matchesRouter,
    path: "/",
    method: "GET",
    guards: [],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ListMatchesAction(requestDispatcher);
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

export default matchesRouter;

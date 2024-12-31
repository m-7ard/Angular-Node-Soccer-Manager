import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import userIsAuthenticatedGuard from "api/guards/userIsAuthenticatedGuard";
import CreateMatchAction from "api/actions/matches/CreateMatchAction";
import ReadMatchAction from "api/actions/matches/ReadMatchAction";
import ListMatchesAction from "api/actions/matches/ListMatchAction";

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

export default matchesRouter;

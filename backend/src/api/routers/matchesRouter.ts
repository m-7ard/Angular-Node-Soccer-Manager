import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import userIsAuthenticatedGuard from "api/guards/userIsAuthenticatedGuard";
import CreateMatchAction from "api/actions/matches/CreateMatchAction";

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

export default matchesRouter;
import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import CreatePlayerAction from "api/actions/players/CreatePlayerAction";
import ListPlayersAction from "api/actions/players/ListPlayersAction";
import UpdatePlayerAction from "api/actions/players/UpdatePlayerAction";
import DeletePlayerAction from "api/actions/players/DeletePlayerAction";
import ReadPlayerAction from "api/actions/players/ReadPlayerAction";
import userIsAuthenticatedGuard from "api/guards/userIsAuthenticatedGuard";
import ReadFullPlayerAction from "api/actions/players/ReadFullPlayerAction";

const playersRouter = Router();

registerAction({
    router: playersRouter,
    path: "/create",
    method: "POST",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreatePlayerAction(requestDispatcher);
    },
});

registerAction({
    router: playersRouter,
    path: "/",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ListPlayersAction(requestDispatcher);
    },
});

registerAction({
    router: playersRouter,
    path: "/:playerId/update",
    method: "PUT",
    guards: [userIsAuthenticatedGuard],
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new UpdatePlayerAction(requestDispatcher);
    },
});

registerAction({
    router: playersRouter,
    path: "/:playerId/delete",
    method: "DELETE",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new DeletePlayerAction(requestDispatcher);
    },
});

registerAction({
    router: playersRouter,
    path: "/:playerId",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ReadPlayerAction(requestDispatcher);
    },
});

registerAction({
    router: playersRouter,
    path: "/:playerId/full",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ReadFullPlayerAction(requestDispatcher);
    },
});

export default playersRouter;

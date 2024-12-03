import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import CreatePlayerAction from "api/actions/players/CreatePlayerAction";
import ListPlayersAction from "api/actions/players/ListPlayersAction";
import UpdatePlayerAction from "api/actions/players/UpdatePlayerAction";
import DeletePlayerAction from "api/actions/players/DeletePlayerAction";

const playersRouter = Router();

registerAction({
    router: playersRouter,
    path: "/create",
    method: "POST",
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


export default playersRouter;

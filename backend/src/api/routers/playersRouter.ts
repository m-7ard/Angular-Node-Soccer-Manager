import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import CreatePlayerAction from "api/actions/players/CreatePlayerAction";
import ListPlayersAction from "api/actions/players/ListPlayersAction";

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

export default playersRouter;

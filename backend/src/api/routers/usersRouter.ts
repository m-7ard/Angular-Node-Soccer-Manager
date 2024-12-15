import { Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import RegisterUserAction from "api/actions/users/RegisterUserAction";
import LoginUserAction from "api/actions/users/LoginUserAction";

const usersRouter = Router();

registerAction({
    router: usersRouter,
    path: "/register",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new RegisterUserAction(requestDispatcher);
    },
});

registerAction({
    router: usersRouter,
    path: "/login",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new LoginUserAction(requestDispatcher);
    },
});

export default usersRouter;

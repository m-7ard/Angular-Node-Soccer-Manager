import { IRouterMatcher, NextFunction, Request, Response, Router } from "express";
import AbstractAction, { IActionResponse } from "../actions/IAction";

function registerAction({
    router,
    initialiseAction,
    path,
    method,
}: {
    router: Router;
    initialiseAction: () => AbstractAction<unknown, IActionResponse>;
    path: string;
    method: "POST" | "GET" | "PUT" | "DELETE";
}) {
    const handleRequest = async (req: Request, res: Response, next: NextFunction) => {
        const action = initialiseAction();
        const guards = action.guards;

        const arg = action.bind(req, res);
        try {
            const result = await action.handle(arg);
            result.handle(res);
        } catch (err) {
            next(err);
        }
    };

    if (method === "POST") {
        router.post(path, handleRequest);
    } else if (method === "GET") {
        router.get(path, handleRequest);
    } else if (method === "PUT") {
        router.put(path, handleRequest);
    } else if (method === "DELETE") {
        router.delete(path, handleRequest);
    }
}

export default registerAction;

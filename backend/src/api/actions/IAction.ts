import { Request, Response } from "express";

export interface IActionResponse {
    handle(res: Response): void;
}

abstract class AbstractAction<ActionReq, ActionRes = IActionResponse> {
    guards: Array<(req: Request, res: Response) => boolean> = [];
    abstract handle(request: ActionReq): Promise<ActionRes>;
    abstract bind(request: Request, response: Response): ActionReq;
}

export default AbstractAction;

import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IDeletePlayerRequestDTO from "api/DTOs/players/delete/IDeletePlayerRequestDTO";
import { DeletePlayerCommand } from "application/handlers/players/DeletePlayerCommandHandler";
import IDeletePlayerResponseDTO from "api/DTOs/players/delete/IDeletePlayerResponseDTO";

type ActionRequest = { dto: IDeletePlayerRequestDTO, playerId: string; };
type ActionResponse = JsonResponse<IDeletePlayerResponseDTO | IApiError[]>;

class DeletePlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { playerId } = request;

        const command = new DeletePlayerCommand({
            id: playerId
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {},
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {},
            playerId: request.params.playerId
        };
    }
}

export default DeletePlayerAction;

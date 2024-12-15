import { Request } from "express";
import AbstractAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IUpdatePlayerRequestDTO from "api/DTOs/players/update/IUpdatePlayerRequestDTO";
import IUpdatePlayerResponseDTO from "api/DTOs/players/update/IUpdatePlayerResponseDTO";
import updatePlayerValidator from "api/validators/updatePlayerValidator";
import { UpdatePlayerCommand } from "application/handlers/players/UpdatePlayerCommandHandler";

type ActionRequest = { dto: IUpdatePlayerRequestDTO; playerId: string };
type ActionResponse = JsonResponse<IUpdatePlayerResponseDTO | IApiError[]>;

class UpdatePlayerAction extends AbstractAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {
        super();
    }

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, playerId } = request;

        const validation = updatePlayerValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const command = new UpdatePlayerCommand({
            id: playerId,
            name: dto.name,
            activeSince: dto.activeSince,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                id: playerId,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            playerId: request.params.playerId,
            dto: {
                name: request.body.name,
                activeSince: new Date(request.body.activeSince),
            },
        };
    }
}

export default UpdatePlayerAction;

import { Request } from "express";
import AbstractAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IReadPlayerRequestDTO from "api/DTOs/players/read/IReadPlayerRequestDTO";
import IReadPlayerResponseDTO from "api/DTOs/players/read/IReadPlayerResponseDTO";
import { ReadPlayerQuery } from "application/handlers/players/ReadPlayerQueryHandler";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

type ActionRequest = { dto: IReadPlayerRequestDTO, playerId: string; };
type ActionResponse = JsonResponse<IReadPlayerResponseDTO | IApiError[]>;

class ReadPlayerAction extends AbstractAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {
        super();
    }

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { playerId } = request;

        const command = new ReadPlayerQuery({
            id: playerId
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const firstError = result.error[0];
            if (firstError.code === VALIDATION_ERROR_CODES.ModelDoesNotExist) {
                return new JsonResponse({
                    status: StatusCodes.NOT_FOUND,
                    body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
                });
            }

            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                player: ApiModelMapper.createPlayerApiModel(result.value)
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {},
            playerId: request.params.playerId
        };
    }
}

export default ReadPlayerAction;

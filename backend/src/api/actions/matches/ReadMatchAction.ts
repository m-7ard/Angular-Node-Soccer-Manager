import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import { Request } from "express";
import IReadMatchRequestDTO from "api/DTOs/matches/read/IReadMatchRequestDTO";
import IReadMatchResponseDTO from "api/DTOs/matches/read/IReadMatchResponseDTO";
import { ReadMatchQuery } from "application/handlers/matches/ReadMatchQueryHandler";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

type ActionRequest = { dto: IReadMatchRequestDTO; matchId: string };
type ActionResponse = JsonResponse<IReadMatchResponseDTO | IApiError[]>;

class ReadMatchAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { matchId } = request;

        const command = new ReadMatchQuery({
            id: matchId,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            if (result.error[0].code === VALIDATION_ERROR_CODES.ModelDoesNotExist) {
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
                match: ApiModelMapper.createMatchApiModel(result.value),
                matchEvents: result.value.events.map(ApiModelMapper.createMatchEventApiModel),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {},
            matchId: request.params.matchId,
        };
    }
}

export default ReadMatchAction;

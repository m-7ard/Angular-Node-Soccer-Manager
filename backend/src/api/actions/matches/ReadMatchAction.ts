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
import IApiModelService from "api/interfaces/IApiModelService";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";

type ActionRequest = { dto: IReadMatchRequestDTO; matchId: string };
type ActionResponse = JsonResponse<IReadMatchResponseDTO | IApiError[]>;

class ReadMatchAction implements IAction<ActionRequest, ActionResponse> {
    constructor(
        private readonly _requestDispatcher: IRequestDispatcher,
        private readonly _apiModelService: IApiModelService,
    ) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { matchId } = request;

        const command = new ReadMatchQuery({
            id: matchId,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const [expectedError] = result.error;

            if (expectedError.code === APPLICATION_SERVICE_CODES.MATCH_EXISTS_ERROR) {
                return new JsonResponse({
                    status: StatusCodes.NOT_FOUND,
                    body: ApiErrorFactory.mapApplicationErrors(result.error),
                });
            }

            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        const match = result.value;

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                match: await this._apiModelService.createMatchApiModel(match),
                matchEvents: await this._apiModelService.createManyMatchEventApiModel(match.events),
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

import IMarkMatchCancelledRequestDTO from "api/DTOs/matches/markMatchCancelled/IMarkMatchCancelledRequestDTO";
import IMarkMatchCancelledResponseDTO from "api/DTOs/matches/markMatchCancelled/IMarkMatchCancelledResponseDTO";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { MarkMatchCancelledCommand } from "application/handlers/matches/MarkMatchCancelledCommandHandler";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";

type ActionRequest = { dto: IMarkMatchCancelledRequestDTO; matchId: string };
type ActionResponse = JsonResponse<IMarkMatchCancelledResponseDTO | IApiError[]>;

class MarkMatchCancelledAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { matchId } = request;

        const command = new MarkMatchCancelledCommand({
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
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                id: matchId,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            matchId: request.params.matchId,
            dto: {},
        };
    }
}

export default MarkMatchCancelledAction;

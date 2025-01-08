import IMarkMatchCompletedRequestDTO from "api/DTOs/matches/markMatchCompleted/IMarkMatchCompletedRequestDTO";
import IMarkMatchCompletedResponseDTO from "api/DTOs/matches/markMatchCompleted/IMarkMatchCompletedResponseDTO";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import parsers from "api/utils/parsers";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { MarkMatchCompletedCommand } from "application/handlers/matches/MarkMatchCompletedCommandHandler";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import { Request } from "express";
import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";

type ActionRequest = { dto: IMarkMatchCompletedRequestDTO; matchId: string };
type ActionResponse = JsonResponse<IMarkMatchCompletedResponseDTO | IApiError[]>;

class MarkMatchCompletedAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, matchId } = request;

        const command = new MarkMatchCompletedCommand({
            id: matchId,
            endDate: dto.endDate,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const [expectedError] = result.error;

            if (expectedError.code === APPLICATION_VALIDATOR_CODES.MATCH_EXISTS_ERROR) {
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
            dto: {
                endDate: parsers.parseDateOrElse(request.body.endDate, "Invalid Date"),
            },
        };
    }
}

export default MarkMatchCompletedAction;

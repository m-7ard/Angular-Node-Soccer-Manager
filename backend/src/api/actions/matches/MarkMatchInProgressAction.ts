import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import { Request } from "express";
import parsers from "api/utils/parsers";
import IMarkMatchInProgressRequestDTO from "api/DTOs/matches/markMatchInProgress/IMarkMatchInProgressRequestDTO";
import IMarkMatchInProgressResponseDTO from "api/DTOs/matches/markMatchInProgress/IMarkMatchInProgressResponseDTO";
import { MarkMatchInProgressCommand } from "application/handlers/matches/MarkMatchInProgressCommandHandler";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

type ActionRequest = { dto: IMarkMatchInProgressRequestDTO; matchId: string };
type ActionResponse = JsonResponse<IMarkMatchInProgressResponseDTO | IApiError[]>;

class MarkMatchInProgressAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, matchId } = request;

        const command = new MarkMatchInProgressCommand({
            id: matchId,
            startDate: dto.startDate,
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
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
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
                startDate: parsers.parseDateOrElse(request.body.startDate, "Invalid Date"),
            },
        };
    }
}

export default MarkMatchInProgressAction;

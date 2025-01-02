import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import { Request } from "express";
import IDeleteMatchRequestDTO from "api/DTOs/matches/delete/IDeleteMatchRequestDTO";
import IDeleteMatchResponseDTO from "api/DTOs/matches/delete/IDeleteMatchResponseDTO";
import { DeleteMatchCommand } from "application/handlers/matches/DeleteMatchCommandHandler";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

type ActionRequest = { dto: IDeleteMatchRequestDTO; matchId: string };
type ActionResponse = JsonResponse<IDeleteMatchResponseDTO | IApiError[]>;

class DeleteMatchAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { matchId } = request;

        const command = new DeleteMatchCommand({
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
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.CREATED,
            body: {},
        });
    }

    bind(request: Request): ActionRequest {
        return {
            matchId: request.params.matchId,
            dto: {},
        };
    }
}

export default DeleteMatchAction;

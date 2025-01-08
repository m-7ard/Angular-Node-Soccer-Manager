import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import IRecordGoalRequestDTO from "api/DTOs/matchEvents/recordGoal/IRecordGoalRequestDTO";
import IRecordGoalResponseDTO from "api/DTOs/matchEvents/recordGoal/IRecordGoalResponseDTO";
import recordGoalValidator from "api/validators/matchEvents/recordGoalValidator";
import { RecordGoalCommand } from "application/handlers/matchEvents/RecordGoalCommandHandler";
import parsers from "api/utils/parsers";

type ActionRequest = { dto: IRecordGoalRequestDTO; matchId: string };
type ActionResponse = JsonResponse<IRecordGoalResponseDTO | IApiError[]>;

class RecordGoalAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, matchId } = request;

        const validation = recordGoalValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const command = new RecordGoalCommand({
            id: matchId,
            playerId: dto.playerId,
            teamId: dto.teamId,
            dateOccured: dto.dateOccured,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.CREATED,
            body: {
                matchId: matchId,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            matchId: request.params.matchId,
            dto: {
                playerId: request.body.playerId,
                teamId: request.body.teamId,
                dateOccured: parsers.parseDateOrElse(request.body.dateOccured, "Invalid Date"),
            },
        };
    }
}

export default RecordGoalAction;

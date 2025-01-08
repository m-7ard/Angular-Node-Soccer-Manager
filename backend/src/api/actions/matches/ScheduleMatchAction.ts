import IScheduleMatchResponseDTO from "api/DTOs/matches/schedule/IScheduleMatchResponseDTO";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import scheduleMatchValidator from "api/validators/matches/scheduleMatchValidator";
import { ScheduleMatchCommand } from "application/handlers/matches/ScheduleMatchCommandHandler";
import IScheduleMatchRequestDTO from "api/DTOs/matches/schedule/IScheduleMatchRequestDTO";

type ActionRequest = { dto: IScheduleMatchRequestDTO };
type ActionResponse = JsonResponse<IScheduleMatchResponseDTO | IApiError[]>;

class ScheduleMatchAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = scheduleMatchValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const guid = crypto.randomUUID();

        const command = new ScheduleMatchCommand({
            id: guid,
            homeTeamId: dto.homeTeamId,
            awayTeamId: dto.awayTeamId,
            venue: dto.venue,
            scheduledDate: dto.scheduledDate,
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
                id: guid,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                homeTeamId: request.body.homeTeamId,
                awayTeamId: request.body.awayTeamId,
                venue: request.body.venue,
                scheduledDate: new Date(request.body.scheduledDate),
            },
        };
    }
}

export default ScheduleMatchAction;

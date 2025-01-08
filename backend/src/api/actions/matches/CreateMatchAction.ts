import ICreateMatchRequestDTO from "api/DTOs/matches/create/ICreateMatchRequestDTO";
import ICreateMatchResponseDTO from "api/DTOs/matches/create/ICreateMatchResponseDTO";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import createMatchValidator from "api/validators/matches/createMatchValidator";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import { Request } from "express";
import parsers from "api/utils/parsers";
import { CreateMatchCommand } from "application/handlers/matches/CreateMatchCommandHandler";
import { Map } from "immutable";
import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";

type ActionRequest = { dto: ICreateMatchRequestDTO };
type ActionResponse = JsonResponse<ICreateMatchResponseDTO | IApiError[]>;

class CreateMatchAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = createMatchValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreateMatchCommand({
            id: guid,
            homeTeamId: dto.homeTeamId,
            awayTeamId: dto.awayTeamId,
            venue: dto.venue,
            scheduledDate: dto.scheduledDate,
            startDate: dto.startDate,
            endDate: dto.endDate,
            status: dto.status,
            goals: dto.goals,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error, {
                    [APPLICATION_VALIDATOR_CODES.IS_VALID_GOAL_ERROR]: ["goals"],
                    [APPLICATION_VALIDATOR_CODES.CAN_ADD_GOAL_ERROR]: ["goals"]
                }),
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
                startDate: request.body.startDate == null ? null : parsers.parseDateOrElse(request.body.startDate, "Invalid Date"),
                endDate: request.body.endDate == null ? null : parsers.parseDateOrElse(request.body.endDate, "Invalid Date"),
                status: request.body.status,
                goals:
                    request.body.goals == null
                        ? null
                        : Map(request.body.goals)
                              .map((value) => ({
                                  dateOccured: parsers.parseDateOrElse(value.dateOccured, "Invalid Date"),
                                  teamId: value.teamId,
                                  playerId: value.playerId,
                              }))
                              .toObject(),
            },
        };
    }
}

export default CreateMatchAction;

import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import { Request } from "express";
import IListMatchesRequestDTO from "api/DTOs/matches/list/IListMatchesRequestDTO";
import IListMatchesResponseDTO from "api/DTOs/matches/list/IListMatchesResponseDTO";
import { ListMatchesQuery } from "application/handlers/matches/ListMatchesQueryHandler";
import parsers from "api/utils/parsers";
import listMatchesValidator from "api/validators/matches/listMatchesValidator";
import IApiModelService from "api/interfaces/IApiModelService";

type ActionRequest = { dto: IListMatchesRequestDTO };
type ActionResponse = JsonResponse<IListMatchesResponseDTO | IApiError[]>;

class ListMatchesAction implements IAction<ActionRequest, ActionResponse> {
    constructor(
        private readonly requestDispatcher: IRequestDispatcher,
        private readonly apiModelService: IApiModelService,
    ) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = listMatchesValidator(dto);
        if (validation.isErr()) {
            validation.error.forEach((error) => {
                dto[error.key as keyof IListMatchesRequestDTO] = null;
            });
        }

        const command = new ListMatchesQuery({
            scheduledDate: dto.scheduledDate,
            status: dto.status,
            limitBy: dto.limitBy,
            teamId: dto.teamId
        });
        const result = await this.requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                matches: await this.apiModelService.createManyMatchApiModels(result.value),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                scheduledDate: request.query.scheduledDate == null ? null : parsers.parseDateOrElse(request.query.scheduledDate, null),
                limitBy: Number(request.query.limitBy),
                status: request.query.status as string,
                teamId: request.query.teamId as string,
            },
        };
    }
}

export default ListMatchesAction;

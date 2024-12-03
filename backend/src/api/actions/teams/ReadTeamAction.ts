import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IReadTeamRequestDTO from "api/DTOs/teams/read/IReadTeamRequestDTO";
import IReadTeamResponseDTO from "api/DTOs/teams/read/IReadTeamResponseDTO";
import { ReadTeamQuery } from "application/handlers/teams/ReadTeamQueryHandler";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApiModelMapper from "api/mappers/ApiModelMapper";

type ActionRequest = { dto: IReadTeamRequestDTO; teamId: string };
type ActionResponse = JsonResponse<IReadTeamResponseDTO | IApiError[]>;

class ReadTeamAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId } = request;

        const command = new ReadTeamQuery({
            id: teamId,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const firstError = result.error[0];
            if (firstError.code === VALIDATION_ERROR_CODES.ModelDoesNotExist) {
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
                team: ApiModelMapper.createTeamApiModel(result.value),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {},
            teamId: request.params.teamId,
        };
    }
}

export default ReadTeamAction;

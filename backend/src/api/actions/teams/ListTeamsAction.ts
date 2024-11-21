import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IListTeamsRequestDTO from "api/DTOs/teams/list/IListTeamsRequestDTO";
import IListTeamsResponseDTO from "api/DTOs/teams/list/IListTeamsResponseDTO";
import { ListTeamsQuery } from "application/handlers/teams/ListTeamsQueryHandler";
import ApiModelMapper from "api/mappers/ApiModelMapper";

type ActionRequest = { dto: IListTeamsRequestDTO };
type ActionResponse = JsonResponse<IListTeamsResponseDTO | IApiError[]>;

class ListTeamsAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;
        const command = new ListTeamsQuery({});
        const teamResult = await this._requestDispatcher.dispatch(command);

        if (teamResult.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(teamResult.error),
            });
        }

        console.log(teamResult.value)

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                teams: teamResult.value.map(ApiModelMapper.createCompactTeamApiModel),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {},
        };
    }
}

export default ListTeamsAction;

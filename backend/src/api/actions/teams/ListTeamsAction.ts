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
import listTeamsValidator from "api/validators/teams/listTeamsValidator";

type ActionRequest = { dto: IListTeamsRequestDTO };
type ActionResponse = JsonResponse<IListTeamsResponseDTO | IApiError[]>;

class ListTeamsAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;
        const validation = listTeamsValidator(dto);
        if (validation.isErr()) {
            validation.error.forEach((error) => {
                dto[error.key as keyof IListTeamsRequestDTO] = null;
            });
        }

        const query = new ListTeamsQuery({
            name: dto.name,
            teamMembershipPlayerId: dto.teamMembershipPlayerId,
            limitBy: dto.limitBy
        });
        const teamResult = await this._requestDispatcher.dispatch(query);

        if (teamResult.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(teamResult.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                teams: teamResult.value.map(ApiModelMapper.createTeamApiModel),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.query.name as string,
                teamMembershipPlayerId: request.query.teamMembershipPlayerId as string,
                limitBy: request.query.limitBy == null ? null : Number(request.query.limitBy) 
            },
        };
    }
}

export default ListTeamsAction;

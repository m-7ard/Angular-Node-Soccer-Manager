import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IListTeamMembershipHistoriesRequestDTO from "api/DTOs/teamMemberships/list-histories/IListTeamMembershipHistoriesRequestDTO";
import IListTeamMembershipHistoriesResponseDTO from "api/DTOs/teamMemberships/list-histories/IListTeamMembershipHistoriesResponseDTO";
import { ReadTeamMembershipQuery } from "application/handlers/team_memberships/ReadTeamMembershipQueryHandler";
import IApiModelService from "api/interfaces/IApiModelService";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";

type ActionRequest = { teamId: string; teamMembershipId: string; dto: IListTeamMembershipHistoriesRequestDTO };
type ActionResponse = JsonResponse<IListTeamMembershipHistoriesResponseDTO | IApiError[]>;

class ListTeamMembershipHistoriesAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly requestDispatcher: IRequestDispatcher, private readonly apiModelService: IApiModelService) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId, teamMembershipId } = request;

        const query = new ReadTeamMembershipQuery({ teamId: teamId, teamMembershipId: teamMembershipId });
        const result = await this.requestDispatcher.dispatch(query);

        if (result.isErr()) {
            const [expectedError] = result.error;
            if (expectedError.code === APPLICATION_SERVICE_CODES.IS_TEAM_MEMBER_ERROR || expectedError.code === APPLICATION_SERVICE_CODES.TEAM_EXISTS_ERROR) {
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
                team: ApiModelMapper.createTeamApiModel(result.value.team),
                teamPlayer: await this.apiModelService.createTeamPlayerApiModel(result.value.teamMembership),
                teamMembershipHistories: result.value.teamMembership.teamMembershipHistories.map(ApiModelMapper.createTeamMembershipHistoryApiModel)
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            teamId: request.params.teamId,
            teamMembershipId: request.params.teamMembershipId,
            dto: {},
        };
    }
}

export default ListTeamMembershipHistoriesAction;

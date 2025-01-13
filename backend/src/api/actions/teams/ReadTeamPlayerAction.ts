import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import IReadTeamPlayerRequestDTO from "api/DTOs/teams/read-team-player/IReadTeamPlayerRequestDTO";
import IReadTeamPlayerResponseDTO from "api/DTOs/teams/read-team-player/IReadTeamPlayerResponseDTO";
import { ReadTeamMembershipQuery } from "application/handlers/team_memberships/ReadTeamMembershipQueryHandler";
import { ReadPlayerQuery } from "application/handlers/players/ReadPlayerQueryHandler";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";

type ActionRequest = { dto: IReadTeamPlayerRequestDTO; teamId: string; teamMembershipId: string };
type ActionResponse = JsonResponse<IReadTeamPlayerResponseDTO | IApiError[]>;

class ReadTeamPlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId, teamMembershipId } = request;

        const query = new ReadTeamMembershipQuery({
            teamId: teamId,
            teamMembershipId: teamMembershipId,
        });
        const result = await this._requestDispatcher.dispatch(query);

        if (result.isErr()) {
            const [expectedError] = result.error;

            if (expectedError.code === APPLICATION_SERVICE_CODES.TEAM_EXISTS_ERROR || expectedError.code === APPLICATION_SERVICE_CODES.IS_TEAM_MEMBER_ERROR) {
                return new JsonResponse({
                    status: StatusCodes.NOT_FOUND,
                    body: ApiErrorFactory.mapApplicationErrors(result.error),
                });
            }

            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        const playerQuery = new ReadPlayerQuery({ id: teamMembershipId });
        const playerQueryResult = await this._requestDispatcher.dispatch(playerQuery);
        if (playerQueryResult.isErr()) {
            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(playerQueryResult.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                team: ApiModelMapper.createTeamApiModel(result.value.team),
                teamPlayer: {
                    membership: ApiModelMapper.createTeamMembershipApiModel(result.value.teamMembership),
                    player: ApiModelMapper.createPlayerApiModel(playerQueryResult.value),
                },
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {},
            teamId: request.params.teamId,
            teamMembershipId: request.params.teamMembershipId,
        };
    }
}

export default ReadTeamPlayerAction;

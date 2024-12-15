import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import IReadTeamPlayerRequestDTO from "api/DTOs/teams/read-team-player/IReadTeamPlayerRequestDTO";
import IReadTeamPlayerResponseDTO from "api/DTOs/teams/read-team-player/IReadTeamPlayerResponseDTO";
import { ReadTeamMembershipQuery } from "application/handlers/team_memberships/ReadTeamMembershipQueryHandler";
import { ReadPlayerQuery } from "application/handlers/players/ReadPlayerQueryHandler";

type ActionRequest = { dto: IReadTeamPlayerRequestDTO; teamId: string; playerId: string };
type ActionResponse = JsonResponse<IReadTeamPlayerResponseDTO | IApiError[]>;

class ReadTeamPlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId, playerId } = request;

        const query = new ReadTeamMembershipQuery({
            teamId: teamId,
            playerId: playerId,
        });
        const result = await this._requestDispatcher.dispatch(query);

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

        const playerQuery = new ReadPlayerQuery({ id: playerId });
        const playerQueryResult = await this._requestDispatcher.dispatch(playerQuery);
        if (playerQueryResult.isErr()) {
            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.applicationErrorToApiErrors(playerQueryResult.error),
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
            playerId: request.params.playerId,
        };
    }
}

export default ReadTeamPlayerAction;

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
import { ReadPlayerQuery } from "application/handlers/players/ReadPlayerQueryHandler";

type ActionRequest = { dto: IReadTeamRequestDTO; teamId: string };
type ActionResponse = JsonResponse<IReadTeamResponseDTO | IApiError[]>;

class ReadTeamAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId } = request;

        const command = new ReadTeamQuery({
            id: teamId,
        });
        const readTeamResult = await this._requestDispatcher.dispatch(command);

        if (readTeamResult.isErr()) {
            const firstError = readTeamResult.error[0];
            if (firstError.code === VALIDATION_ERROR_CODES.ModelDoesNotExist) {
                return new JsonResponse({
                    status: StatusCodes.NOT_FOUND,
                    body: ApiErrorFactory.applicationErrorToApiErrors(readTeamResult.error),
                });
            }

            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.applicationErrorToApiErrors(readTeamResult.error),
            });
        }

        const team = readTeamResult.value;
        const responseDTO: IReadTeamResponseDTO = {
            team: ApiModelMapper.createTeamApiModel(team),
            teamPlayers: [],
        };

        for (let i = 0; i < team.teamMemberships.length; i++) {
            const membership = team.teamMemberships[i];
            const readPlayerQuery = new ReadPlayerQuery({
                id: membership.playerId,
            });

            const readPlayerResult = await this._requestDispatcher.dispatch(readPlayerQuery);

            if (readPlayerResult.isErr()) {
                return new JsonResponse({
                    status: StatusCodes.INTERNAL_SERVER_ERROR,
                    body: ApiErrorFactory.applicationErrorToApiErrors(readPlayerResult.error),
                });
            }

            responseDTO.teamPlayers.push({
                player: ApiModelMapper.createPlayerApiModel(readPlayerResult.value),
                membership: ApiModelMapper.createTeamMembershipApiModel(membership),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: responseDTO,
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

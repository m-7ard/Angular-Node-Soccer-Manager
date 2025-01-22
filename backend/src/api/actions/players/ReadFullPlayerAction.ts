import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import IReadFullPlayerRequestDTO from "api/DTOs/players/read-full/IReadPlayerRequestDTO";
import IReadFullPlayerResponseDTO from "api/DTOs/players/read-full/IReadPlayerResponseDTO";
import { ReadFullPlayerQuery } from "application/handlers/players/ReadFullPlayerQueryHandler";

type ActionRequest = { dto: IReadFullPlayerRequestDTO; playerId: string };
type ActionResponse = JsonResponse<IReadFullPlayerResponseDTO | IApiError[]>;

class ReadFullPlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { playerId } = request;

        const command = new ReadFullPlayerQuery({
            id: playerId,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const [expectedError] = result.error;

            if (expectedError.code === APPLICATION_SERVICE_CODES.PLAYER_EXISTS_ERROR) {
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

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                player: ApiModelMapper.createPlayerApiModel(result.value.player),
                currentTeams: result.value.currentTeams.map(ApiModelMapper.createTeamApiModel),
                formerTeams: result.value.formerTeams.map(ApiModelMapper.createTeamApiModel),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {},
            playerId: request.params.playerId,
        };
    }
}

export default ReadFullPlayerAction;

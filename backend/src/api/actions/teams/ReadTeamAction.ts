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
import ApiModelMapper from "api/mappers/ApiModelMapper";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import IApiModelService from "api/interfaces/IApiModelService";

type ActionRequest = { dto: IReadTeamRequestDTO; teamId: string };
type ActionResponse = JsonResponse<IReadTeamResponseDTO | IApiError[]>;

class ReadTeamAction implements IAction<ActionRequest, ActionResponse> {
    constructor(
        private readonly _requestDispatcher: IRequestDispatcher,
        private readonly apiModelService: IApiModelService,
    ) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId } = request;

        const command = new ReadTeamQuery({
            id: teamId,
        });
        const readTeamResult = await this._requestDispatcher.dispatch(command);

        if (readTeamResult.isErr()) {
            const [expectedError] = readTeamResult.error;

            if (expectedError.code === APPLICATION_SERVICE_CODES.TEAM_EXISTS_ERROR) {
                return new JsonResponse({
                    status: StatusCodes.NOT_FOUND,
                    body: ApiErrorFactory.mapApplicationErrors(readTeamResult.error),
                });
            }

            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(readTeamResult.error),
            });
        }

        const team = readTeamResult.value;
        const responseDTO: IReadTeamResponseDTO = {
            team: ApiModelMapper.createTeamApiModel(team),
            teamPlayers: await this.apiModelService.createManyTeamPlayerApiModel(team.teamMemberships),
        };

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

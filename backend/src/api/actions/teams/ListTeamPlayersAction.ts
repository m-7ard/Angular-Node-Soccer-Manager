import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import IListTeamPlayersResponseDTO from "api/DTOs/teams/list-team-players/IListTeamPlayersResponseDTO";
import IListTeamPlayersRequestDTO from "api/DTOs/teams/list-team-players/IListTeamPlayersRequestDTO";
import { ReadTeamQuery } from "application/handlers/teams/ReadTeamQueryHandler";
import IApiModelService from "api/interfaces/IApiModelService";

type ActionRequest = { dto: IListTeamPlayersRequestDTO; params: { teamId: string } };
type ActionResponse = JsonResponse<IListTeamPlayersResponseDTO | IApiError[]>;

class ListTeamPlayersAction implements IAction<ActionRequest, ActionResponse> {
    constructor(
        private readonly _requestDispatcher: IRequestDispatcher,
        private readonly apiModelService: IApiModelService,
    ) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { params } = request;

        const readTeamQuery = new ReadTeamQuery({ id: params.teamId });
        const readTeamResult = await this._requestDispatcher.dispatch(readTeamQuery);

        if (readTeamResult.isErr()) {
            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(readTeamResult.error),
            });
        }

        const team = readTeamResult.value;
        const responseDTO: IListTeamPlayersResponseDTO = {
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
            params: {
                teamId: request.params.teamId,
            },
        };
    }
}

export default ListTeamPlayersAction;

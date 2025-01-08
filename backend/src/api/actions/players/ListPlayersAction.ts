import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IListPlayersRequestDTO from "api/DTOs/players/list/IListPlayersRequestDTO";
import IListPlayersResponseDTO from "api/DTOs/players/list/IListPlayersResponseDTO";
import { ListPlayersQuery } from "application/handlers/players/ListPlayersQueryHandler";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import listPlayersValidator from "api/validators/players/listPlayersValidator";

type ActionRequest = { dto: IListPlayersRequestDTO };
type ActionResponse = JsonResponse<IListPlayersResponseDTO | IApiError[]>;

class ListPlayersAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;
        const validation = listPlayersValidator(dto);
        if (validation.isErr()) {
            validation.error.forEach((error) => {
                dto[error.key as keyof IListPlayersRequestDTO] = null;
            });
        }

        const query = new ListPlayersQuery({
            name: dto.name,
            limitBy: dto.limitBy,
        });
        const result = await this._requestDispatcher.dispatch(query);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                players: result.value.map(ApiModelMapper.createPlayerApiModel),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.query.name as string,
                limitBy: Number(request.query.limitBy),
            },
        };
    }
}

export default ListPlayersAction;

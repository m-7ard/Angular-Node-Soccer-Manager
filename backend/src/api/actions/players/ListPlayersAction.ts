import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IListPlayersRequestDTO from "api/DTOs/players/list/IListPlayersRequestDTO";
import IListPlayersResponseDTO from "api/DTOs/players/list/IListPlayersResponseDTO";
import { ListPlayersQuery } from "application/handlers/players/ListPlayersCommandHandler";

type ActionRequest = { dto: IListPlayersRequestDTO };
type ActionResponse = JsonResponse<IListPlayersResponseDTO | IApiError[]>;

class ListPlayersAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const query = new ListPlayersQuery({
            name: dto.name
        });
        const result = await this._requestDispatcher.dispatch(query);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                players: result.value
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.query.name as string
            },
        };
    }
}

export default ListPlayersAction;

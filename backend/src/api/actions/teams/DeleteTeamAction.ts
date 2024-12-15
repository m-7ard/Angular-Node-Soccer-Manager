import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import { DeleteTeamCommand } from "../../../application/handlers/teams/DeleteTeamCommandHandler";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IDeleteTeamRequestDTO from "api/DTOs/teams/delete/IDeleteTeamRequestDTO";
import IDeleteTeamResponseDTO from "api/DTOs/teams/delete/IDeleteTeamResponseDTO";

type ActionRequest = { dto: IDeleteTeamRequestDTO; teamId: string };
type ActionResponse = JsonResponse<IDeleteTeamResponseDTO | IApiError[]>;

class DeleteTeamAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}
    
    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId } = request;

        const command = new DeleteTeamCommand({
            id: teamId,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {},
        });
    }


    bind(request: Request): ActionRequest {
        return {
            teamId: request.params.teamId,
            dto: {
                name: request.body.name,
                dateFounded: new Date(request.body.dateFounded),
            },
        };
    }
}

export default DeleteTeamAction;

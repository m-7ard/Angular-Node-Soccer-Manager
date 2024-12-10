import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IDeleteTeamMembershipRequestDTO from "api/DTOs/teamMemberships/delete/IDeleteTeamMembershipRequestDTO";
import IDeleteTeamMembershipResponseDTO from "api/DTOs/teamMemberships/delete/IDeleteTeamMembershipResponseDTO";
import { DeleteTeamMembershipCommand } from "application/handlers/team_memberships/DeleteTeamMembershipCommandHandler";

type ActionRequest = { teamId: string; playerId: string; dto: IDeleteTeamMembershipRequestDTO };
type ActionResponse = JsonResponse<IDeleteTeamMembershipResponseDTO | IApiError[]>;

class DeleteTeamMembershipAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId, playerId } = request;

        const command = new DeleteTeamMembershipCommand({
            teamId: teamId,
            playerId: playerId,
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
            playerId: request.params.playerId,
            dto: {},
        };
    }
}

export default DeleteTeamMembershipAction;

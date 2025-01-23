import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IDeleteTeamMembershipHistoryRequestDTO from "api/DTOs/teamMembershipHistories/delete/IDeleteTeamMembershipHistoryRequestDTO";
import IDeleteTeamMembershipHistoryResponseDTO from "api/DTOs/teamMembershipHistories/delete/IDeleteTeamMembershipHistoryResponseDTO";
import { DeleteTeamMembershipHistoryCommand } from "application/handlers/team_membership_histories/DeleteTeamMembershipHistoryCommandHandler";

type ActionRequest = { teamId: string; teamMembershipId: string; teamMembershipHistoryId: string; dto: IDeleteTeamMembershipHistoryRequestDTO };
type ActionResponse = JsonResponse<IDeleteTeamMembershipHistoryResponseDTO | IApiError[]>;

class DeleteTeamMembershipHistoryAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { teamId, teamMembershipId, teamMembershipHistoryId } = request;

        const command = new DeleteTeamMembershipHistoryCommand({
            teamId: teamId,
            teamMembershipId: teamMembershipId,
            teamMembershipHistoryId: teamMembershipHistoryId,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                teamId: teamId,
                teamMembershipId: teamMembershipId,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            teamId: request.params.teamId,
            teamMembershipId: request.params.teamMembershipId,
            teamMembershipHistoryId: request.params.teamMembershipHistoryId,
            dto: {},
        };
    }
}

export default DeleteTeamMembershipHistoryAction;

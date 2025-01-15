import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import parsers from "api/utils/parsers";
import IUpdateTeamMembershipHistoryRequestDTO from "api/DTOs/teamMembershipHistories/update/IUpdateTeamMembershipHistoryRequestDTO";
import IUpdateTeamMembershipHistoryResponseDTO from "api/DTOs/teamMembershipHistories/update/IUpdateTeamMembershipHistoryResponseDTO";
import updateTeamMembershipHistoryValidator from "api/validators/teamMembershipHistory/updateTeamMembershipHistoryValidator";
import { UpdateTeamMembershipHistoryCommand } from "application/handlers/team_membership_histories/UpdateTeamMembershipHistoryCommandHandler";

type ActionRequest = { teamId: string; teamMembershipId: string; teamMembershipHistoryId: string; dto: IUpdateTeamMembershipHistoryRequestDTO };
type ActionResponse = JsonResponse<IUpdateTeamMembershipHistoryResponseDTO | IApiError[]>;

class UpdateTeamMembershipHistoryAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, teamId, teamMembershipId, teamMembershipHistoryId } = request;

        const validation = updateTeamMembershipHistoryValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const command = new UpdateTeamMembershipHistoryCommand({
            teamId: teamId,
            teamMembershipId: teamMembershipId,
            teamMembershipHistoryId: teamMembershipHistoryId,
            dateEffectiveFrom: dto.dateEffectiveFrom,
            number: dto.number,
            position: dto.position,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.CREATED,
            body: {
                teamId: teamId,
                teamMembershipId: teamMembershipId,
                teamMembershipHistoryId: teamMembershipHistoryId,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            teamId: request.params.teamId,
            teamMembershipId: request.params.teamMembershipId,
            teamMembershipHistoryId: request.params.teamMembershipHistoryId,
            dto: {
                dateEffectiveFrom: parsers.parseDateOrElse(request.body.dateEffectiveFrom, "Invalid Date"),
                number: request.body.number,
                position: request.body.position,
            },
        };
    }
}

export default UpdateTeamMembershipHistoryAction;

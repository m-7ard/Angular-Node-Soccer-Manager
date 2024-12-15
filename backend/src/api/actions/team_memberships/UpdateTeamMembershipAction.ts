import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { UpdateTeamMembershipCommand } from "application/handlers/team_memberships/UpdateTeamMembershipCommandHandler";
import parsers from "api/utils/parsers";
import IUpdateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/update/IUpdateTeamMembershipRequestDTO";
import IUpdateTeamMembershipResponseDTO from "api/DTOs/teamMemberships/update/IUpdateTeamMembershipResponseDTO";
import updateTeamMembershipValidator from "api/validators/updateTeamMembershipValidator";

type ActionRequest = { teamId: string; playerId: string; dto: IUpdateTeamMembershipRequestDTO };
type ActionResponse = JsonResponse<IUpdateTeamMembershipResponseDTO | IApiError[]>;

class UpdateTeamMembershipAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, teamId, playerId } = request;

        const validation = updateTeamMembershipValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const command = new UpdateTeamMembershipCommand({
            teamId: teamId,
            playerId: playerId,
            activeFrom: dto.activeFrom,
            activeTo: dto.activeTo,
            number: dto.number,
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
            dto: {
                activeFrom: parsers.parseDateOrElse(request.body.activeFrom, "Invalid Date"),
                activeTo: request.body.activeTo == null ? null : parsers.parseDateOrElse(request.body.activeTo, "Invalid Date"),
                number: parseInt(request.body.number),
            },
        };
    }
}

export default UpdateTeamMembershipAction;

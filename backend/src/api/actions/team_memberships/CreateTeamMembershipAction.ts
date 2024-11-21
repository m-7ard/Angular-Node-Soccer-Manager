import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ICreateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/create/ICreateTeamMembershipRequestDTO";
import ICreateTeamMembershipResponseDTO from "api/DTOs/teamMemberships/create/ICreateTeamMembershipResponseDTO";
import createTeamMembershipValidator from "api/validators/createTeamMembershipValidator";
import { CreateTeamMembershipCommand } from "application/handlers/team_memberships/CreateTeamMembershipCommandHandler";

type ActionRequest = { teamId: string; dto: ICreateTeamMembershipRequestDTO };
type ActionResponse = JsonResponse<ICreateTeamMembershipResponseDTO | IApiError[]>;

class CreateTeamMembershipAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = createTeamMembershipValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.typeBoxErrorToApiErrors(validation.error),
            });
        }

        const command = new CreateTeamMembershipCommand({
            teamId: request.teamId,
            playerId: dto.playerId,
            activeFrom: dto.activeFrom,
            activeTo: dto.activeTo,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.CREATED,
            body: {},
        });
    }

    bind(request: Request): ActionRequest {
        return {
            teamId: request.params.teamId,
            dto: {
                playerId: request.body.playerId,
                activeFrom: new Date(request.body.activeFrom),
                activeTo: new Date(request.body.activeTo),
            },
        };
    }
}

export default CreateTeamMembershipAction;

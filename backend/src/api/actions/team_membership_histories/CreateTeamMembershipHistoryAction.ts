import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import parsers from "api/utils/parsers";
import ICreateTeamMembershipHistoryRequestDTO from "api/DTOs/teamMembershipHistories/create/ICreateTeamMembershipHistoryRequestDTO";
import ICreateTeamMembershipHistoryResponseDTO from "api/DTOs/teamMembershipHistories/create/ICreateTeamMembershipHistoryResponseDTO";
import createTeamMembershipHistoryValidator from "api/validators/teamMembershipHistory/createTeamMembershipHistoryValidator";
import { CreateTeamMembershipHistoryCommand } from "application/handlers/team_membership_histories/CreateTeamMembershipHistoryCommandHandler";

type ActionRequest = { teamId: string; teamMembershipId: string; dto: ICreateTeamMembershipHistoryRequestDTO };
type ActionResponse = JsonResponse<ICreateTeamMembershipHistoryResponseDTO | IApiError[]>;

class CreateTeamMembershipHistoryAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, teamId, teamMembershipId } = request;

        const validation = createTeamMembershipHistoryValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const id = crypto.randomUUID();

        const command = new CreateTeamMembershipHistoryCommand({
            id: id,
            teamId: teamId,
            teamMembershipId: teamMembershipId,
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
                teamMembershipHistoryId: id,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            teamId: request.params.teamId,
            teamMembershipId: request.params.teamMembershipId,
            dto: {
                dateEffectiveFrom: parsers.parseDateOrElse(request.body.dateEffectiveFrom, "Invalid Date"),
                number: request.body.number,
                position: request.body.position,
            },
        };
    }
}

export default CreateTeamMembershipHistoryAction;

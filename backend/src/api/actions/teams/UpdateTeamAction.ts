import { Request, Response } from "express";
import AbstractAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import updateTeamValidator from "api/validators/updateTeamValidator";
import { UpdateTeamCommand } from "application/handlers/teams/UpdateTeamCommandHandler";
import IUpdateTeamRequestDTO from "api/DTOs/teams/update/IUpdateTeamRequestDTO";
import IUpdateTeamResponseDTO from "api/DTOs/teams/update/IUpdateTeamResponseDTO";

type ActionRequest = { dto: IUpdateTeamRequestDTO; teamId: string };
type ActionResponse = JsonResponse<IUpdateTeamResponseDTO | IApiError[]>;

class UpdateTeamAction extends AbstractAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {
        super();
    }

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, teamId } = request;

        const validation = updateTeamValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const command = new UpdateTeamCommand({
            id: teamId,
            name: dto.name,
            dateFounded: dto.dateFounded,
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
            body: {
                id: teamId,
            },
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

export default UpdateTeamAction;

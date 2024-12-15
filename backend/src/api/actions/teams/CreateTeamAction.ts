import { Request } from "express";
import ICreateTeamRequestDTO from "../../DTOs/teams/create/ICreateTeamRequestDTO";
import ICreateTeamResponseDTO from "../../DTOs/teams/create/ICreateTeamResponseDTO";
import AbstractAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import createTeamValidator from "../../validators/createTeamValidator";
import { StatusCodes } from "http-status-codes";
import { CreateTeamCommand } from "../../../application/handlers/teams/CreateTeamCommandHandler";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";

type ActionRequest = { dto: ICreateTeamRequestDTO };
type ActionResponse = JsonResponse<ICreateTeamResponseDTO | IApiError[]>;

class CreateTeamAction extends AbstractAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {
        super();
    }
    
    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = createTeamValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.typeBoxErrorToApiErrors(validation.error),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreateTeamCommand({
            id: guid,
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
            status: StatusCodes.CREATED,
            body: {
                id: guid,
            },
        });
    }


    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.body.name,
                dateFounded: new Date(request.body.dateFounded),
            },
        };
    }
}

export default CreateTeamAction;

import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ICreatePlayerRequestDTO from "api/DTOs/players/create/ICreatePlayerRequestDTO";
import ICreatePlayerResponseDTO from "api/DTOs/players/create/ICreatePlayerResponseDTO";
import createPlayerValidator from "api/validators/players/createPlayerValidator";
import { CreatePlayerCommand } from "application/handlers/players/CreatePlayerCommandHandler";

type ActionRequest = { dto: ICreatePlayerRequestDTO };
type ActionResponse = JsonResponse<ICreatePlayerResponseDTO | IApiError[]>;

class CreatePlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = createPlayerValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.typeBoxErrorToApiErrors(validation.error),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreatePlayerCommand({
            id: guid,
            name: dto.name,
            activeSince: dto.activeSince,
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
                activeSince: new Date(request.body.activeSince),
            },
        };
    }
}

export default CreatePlayerAction;

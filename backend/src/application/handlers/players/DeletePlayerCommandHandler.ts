import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

export type DeletePlayerCommandResult = ICommandResult<IApplicationError[]>;

export class DeletePlayerCommand implements ICommand<DeletePlayerCommandResult> {
    __returnType: DeletePlayerCommandResult = null!;

    constructor({ id,  }: { id: string;  }) {
        this.id = id;
    }

    public id: string;
}

export default class CreateTeamCommandHandler implements IRequestHandler<DeletePlayerCommand, DeletePlayerCommandResult> {
    private readonly _playerRepository: IPlayerRepository;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
    }

    async handle(command: DeletePlayerCommand): Promise<DeletePlayerCommandResult> {
        const player = await this._playerRepository.getByIdAsync(command.id);
        if (player == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Player of id "${command.id}" does not exist.`,
                    path: ["_"],
                    code: VALIDATION_ERROR_CODES.ModelAlreadyExists,
                }),
            );
        }

        await this._playerRepository.deleteAsync(player);
        return ok(undefined);
    }
}

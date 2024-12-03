import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import PlayerFactory from "domain/domainFactories/PlayerFactory";

export type UpdatePlayerCommandResult = ICommandResult<IApplicationError[]>;

export class UpdatePlayerCommand implements ICommand<UpdatePlayerCommandResult> {
    __returnType: UpdatePlayerCommandResult = null!;

    constructor({ id, name, activeSince }: { id: string; name: string; activeSince: Date }) {
        this.id = id;
        this.name = name;
        this.activeSince = activeSince;
    }

    public id: string;
    public name: string;
    public activeSince: Date;
}

export default class CreateTeamCommandHandler implements IRequestHandler<UpdatePlayerCommand, UpdatePlayerCommandResult> {
    private readonly _playerRepository: IPlayerRepository;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
    }

    async handle(command: UpdatePlayerCommand): Promise<UpdatePlayerCommandResult> {
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

        const updatedPlayer = PlayerFactory.CreateExisting({
            id: player.id,
            name: command.name,
            activeSince: command.activeSince,
        });

        await this._playerRepository.updateAsync(updatedPlayer);
        return ok(undefined);
    }
}

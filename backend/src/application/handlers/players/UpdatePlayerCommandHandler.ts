import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import PlayerExistsValidator from "application/validators/PlayerExistsValidator";

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
    private readonly playerExistsValidator: PlayerExistsValidator;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
        this.playerExistsValidator = new PlayerExistsValidator(props.playerRepository);
    }

    async handle(command: UpdatePlayerCommand): Promise<UpdatePlayerCommandResult> {
        const playerExistsResult = await this.playerExistsValidator.validate({ id: command.id });
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const player = playerExistsResult.value;
        player.name = command.name;
        player.activeSince = command.activeSince;

        await this._playerRepository.updateAsync(player);
        return ok(undefined);
    }
}

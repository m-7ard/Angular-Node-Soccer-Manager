import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import IApplicationError from "application/errors/IApplicationError";

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

export default class UpdatePlayerCommandHandler implements IRequestHandler<UpdatePlayerCommand, UpdatePlayerCommandResult> {
    private readonly _playerRepository: IPlayerRepository;
    private readonly playerExistsValidator: IPlayerValidator<PlayerId>;

    constructor(props: { playerRepository: IPlayerRepository; playerExistsValidator: IPlayerValidator<PlayerId> }) {
        this._playerRepository = props.playerRepository;
        this.playerExistsValidator = props.playerExistsValidator;
    }

    async handle(command: UpdatePlayerCommand): Promise<UpdatePlayerCommandResult> {
        const playerExistsResult = await this.playerExistsValidator.validate(PlayerId.executeCreate(command.id));
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

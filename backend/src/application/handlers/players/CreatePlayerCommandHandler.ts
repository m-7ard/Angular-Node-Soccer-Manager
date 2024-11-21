import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import Player from "domain/entities/Player";

export type CreatePlayerCommandResult = ICommandResult<IApplicationError[]>;

export class CreatePlayerCommand implements ICommand<CreatePlayerCommandResult> {
    __returnType: CreatePlayerCommandResult = null!;

    constructor({ id, name, activeSince, number }: { id: string; name: string; activeSince: Date; number: number }) {
        this.id = id;
        this.name = name;
        this.activeSince = activeSince;
        this.number = number;
    }

    public id: string;
    public name: string;
    public activeSince: Date;
    public number: number;
}

export default class CreateTeamCommandHandler
    implements IRequestHandler<CreatePlayerCommand, CreatePlayerCommandResult>
{
    private readonly _playerRepository: IPlayerRepository;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
    }

    async handle(command: CreatePlayerCommand): Promise<CreatePlayerCommandResult> {
        const player = new Player({
            id: command.id,
            name: command.name,
            activeSince: command.activeSince,
            number: command.number,
        });

        await this._playerRepository.createAsync(player);
        return ok(undefined);
    }
}

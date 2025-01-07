import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import Player from "domain/entities/Player";
import PlayerExistsValidator from "application/validators/PlayerExistsValidator";

export type ReadPlayerQueryResult = IQueryResult<Player, IApplicationError[]>;

export class ReadPlayerQuery implements IQuery<ReadPlayerQueryResult> {
    __returnType: ReadPlayerQueryResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadPlayerQueryHandler implements IRequestHandler<ReadPlayerQuery, ReadPlayerQueryResult> {
    private readonly _playerRepository: IPlayerRepository;
    private readonly playerExistsValidator: PlayerExistsValidator;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
        this.playerExistsValidator = new PlayerExistsValidator(props.playerRepository);
    }

    async handle(query: ReadPlayerQuery): Promise<ReadPlayerQueryResult> {
        const playerExistsResult = await this.playerExistsValidator.validate({ id: query.id });
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const player = playerExistsResult.value;

        return ok(player);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import Player from "domain/entities/Player";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import validationErrorCodes from "application/errors/validationErrorCodes";

export type ReadPlayerQueryResult = IQueryResult<Player, IApplicationError[]>;

export class ReadPlayersQuery implements IQuery<ReadPlayerQueryResult> {
    __returnType: ReadPlayerQueryResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadPlayersQueryHandler implements IRequestHandler<ReadPlayersQuery, ReadPlayerQueryResult> {
    private readonly _playerRepository: IPlayerRepository;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
    }

    async handle(query: ReadPlayersQuery): Promise<ReadPlayerQueryResult> {
        const player = await this._playerRepository.getByIdAsync(query.id);

        if (player == null) {
            return err(ApplicationErrorFactory.createSingleListError({
                message: `Player of id "${query.id} does not exist".`,
                path: ["_"],
                code: validationErrorCodes.ModelDoesNotExist
            }))
        }

        return ok(player);
    }
}

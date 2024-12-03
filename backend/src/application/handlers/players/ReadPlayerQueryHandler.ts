import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import Player from "domain/entities/Player";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

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

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
    }

    async handle(query: ReadPlayerQuery): Promise<ReadPlayerQueryResult> {
        const player = await this._playerRepository.getByIdAsync(query.id);

        if (player == null) {
            return err(ApplicationErrorFactory.createSingleListError({
                message: `Player of id "${query.id} does not exist".`,
                path: ["_"],
                code: VALIDATION_ERROR_CODES.ModelDoesNotExist
            }))
        }

        return ok(player);
    }
}

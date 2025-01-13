import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import Player from "domain/entities/Player";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import IApplicationError from "application/errors/IApplicationError";

export type ReadPlayerQueryResult = IQueryResult<Player, IApplicationError[]>;

export class ReadPlayerQuery implements IQuery<ReadPlayerQueryResult> {
    __returnType: ReadPlayerQueryResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadPlayerQueryHandler implements IRequestHandler<ReadPlayerQuery, ReadPlayerQueryResult> {
    private readonly playerExistsValidator: IPlayerValidator<PlayerId>;

    constructor(props: { playerExistsValidator: IPlayerValidator<PlayerId> }) {
        this.playerExistsValidator = props.playerExistsValidator;
    }

    async handle(query: ReadPlayerQuery): Promise<ReadPlayerQueryResult> {
        const playerExistsResult = await this.playerExistsValidator.validate(PlayerId.executeCreate(query.id));
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const player = playerExistsResult.value;

        return ok(player);
    }
}

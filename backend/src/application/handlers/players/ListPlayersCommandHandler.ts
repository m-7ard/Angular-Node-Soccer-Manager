import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import Player from "domain/entities/Player";

export type ListPlayersQueryResult = IQueryResult<Player[], IApplicationError[]>;

export class ListPlayersQuery implements IQuery<ListPlayersQueryResult> {
    __returnType: ListPlayersQueryResult = null!;

    constructor({ name }: { name: string | null }) {
        this.name = name;
    }

    public name: string | null;
}

export default class ListPlayersQueryHandler implements IRequestHandler<ListPlayersQuery, ListPlayersQueryResult> {
    private readonly _playerRepository: IPlayerRepository;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
    }

    async handle(query: ListPlayersQuery): Promise<ListPlayersQueryResult> {
        console.log(query);
        const players = await this._playerRepository.findAllAsync({
            name: query.name
        });

        return ok(players);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import Player from "domain/entities/Player";
import FilterAllPlayersCriteria from "infrastructure/contracts/FilterAllPlayersCriteria";
import IApplicationError from "application/errors/IApplicationError";

export type ListPlayersQueryResult = IQueryResult<Player[], IApplicationError[]>;

export class ListPlayersQuery implements IQuery<ListPlayersQueryResult> {
    __returnType: ListPlayersQueryResult = null!;

    constructor(props: { name: string | null; limitBy: number | null }) {
        this.name = props.name;
        this.limitBy = props.limitBy;
    }

    public name: string | null;
    public limitBy: number | null;
}

export default class ListPlayersQueryHandler implements IRequestHandler<ListPlayersQuery, ListPlayersQueryResult> {
    private readonly _playerRepository: IPlayerRepository;

    constructor(props: { playerRepository: IPlayerRepository }) {
        this._playerRepository = props.playerRepository;
    }

    async handle(query: ListPlayersQuery): Promise<ListPlayersQueryResult> {
        if (query.limitBy != null && ![5, 24].includes(query.limitBy)) {
            query.limitBy = 24;
        }

        const criteria = new FilterAllPlayersCriteria({
            name: query.name,
            limitBy: query.limitBy
        });

        const players = await this._playerRepository.findAllAsync(criteria);

        return ok(players);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import { ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import IQuery, { IQueryResult } from "../IQuery";
import Match from "domain/entities/Match";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import FilterAllMatchesCriteria from "infrastructure/contracts/FilterAllMatchesCriteria";

type QueryProps = {
    scheduledDate: Date | null;
    status: string | null;
    limitBy: number | null;
};

export type ListMatchesQueryResult = IQueryResult<Match[], IApplicationError[]>;

export class ListMatchesQuery implements IQuery<ListMatchesQueryResult>, QueryProps {
    __returnType: ListMatchesQueryResult = null!;

    constructor(props: QueryProps) {
        this.scheduledDate = props.scheduledDate;
        this.status = props.status;
        this.limitBy = props.limitBy;
    }

    scheduledDate: Date | null;
    status: string | null;
    limitBy: number | null;
}

export default class ListMatchesQueryHandler implements IRequestHandler<ListMatchesQuery, ListMatchesQueryResult> {
    private readonly _matchRepository: IMatchRepository;

    constructor(props: { matchRepository: IMatchRepository }) {
        this._matchRepository = props.matchRepository;
    }

    async handle(query: ListMatchesQuery): Promise<ListMatchesQueryResult> {
        if (query.status != null) {
            const statusResult = MatchStatus.tryCreate(query.status);
            if (statusResult.isErr()) {
                query.status = null;
            }
        }

        if (query.limitBy != null && ![5, 24].includes(query.limitBy)) {
            query.limitBy = 24;
        }

        const criteria = new FilterAllMatchesCriteria({
            limitBy: query.limitBy,
            scheduledDate: query.scheduledDate,
            status: query.status,
        });

        const matches = await this._matchRepository.filterAllAsync(criteria);
        return ok(matches);
    }
}

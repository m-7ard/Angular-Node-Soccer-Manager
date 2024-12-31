import { IRequestHandler } from "../IRequestHandler";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IQuery, { IQueryResult } from "../IQuery";
import Match from "domain/entities/Match";

type QueryProps = {
    id: string;
};

export type ReadMatchQueryResult = IQueryResult<Match, IApplicationError[]>;

export class ReadMatchQuery implements IQuery<ReadMatchQueryResult>, QueryProps {
    __returnType: ReadMatchQueryResult = null!;

    constructor(props: QueryProps) {
        this.id = props.id;
    }

    id: string;
}

export default class ReadMatchQueryHandler implements IRequestHandler<ReadMatchQuery, ReadMatchQueryResult> {
    private readonly _matchRepository: IMatchRepository;

    constructor(props: { matchRepository: IMatchRepository; }) {
        this._matchRepository = props.matchRepository;
    }

    async handle(query: ReadMatchQuery): Promise<ReadMatchQueryResult> {
        const match = await this._matchRepository.getByIdAsync(query.id);

        if (match == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                    message: `Match of id "${query.id}" does not exist.`,
                    path: ["_"],
                }),
            );
        }

        return ok(match);
    }
}

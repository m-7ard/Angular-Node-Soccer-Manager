import { IRequestHandler } from "../IRequestHandler";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IQuery, { IQueryResult } from "../IQuery";
import Match from "domain/entities/Match";
import MatchExistsValidator from "application/validators/MatchExistsValidator";

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
    private readonly matchExistsValidator: MatchExistsValidator;

    constructor(props: { matchRepository: IMatchRepository; }) {
        this._matchRepository = props.matchRepository;
        this.matchExistsValidator = new MatchExistsValidator(props.matchRepository);
    }

    async handle(query: ReadMatchQuery): Promise<ReadMatchQueryResult> {
        const matchExistsResult = await this.matchExistsValidator.validate({ id: query.id });
        if (matchExistsResult.isErr()) {
            return err(matchExistsResult.error);
        }

        const match = matchExistsResult.value;

        return ok(match);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import MatchDomainService from "domain/domainService/MatchDomainService";
import MatchExistsValidator from "application/validators/MatchExistsValidator";

type CommandProps = {
    id: string;
    endDate: Date;
};

export type MarkMatchCompletedCommandResult = ICommandResult<IApplicationError[]>;

export class MarkMatchCompletedCommand implements ICommand<MarkMatchCompletedCommandResult>, CommandProps {
    __returnType: MarkMatchCompletedCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
        this.endDate = props.endDate;
    }

    id: string;
    endDate: Date;
}

export default class MarkMatchCompletedCommandHandler implements IRequestHandler<MarkMatchCompletedCommand, MarkMatchCompletedCommandResult> {
    private readonly _matchRepository: IMatchRepository;
    private readonly matchExistsValidator: MatchExistsValidator;

    constructor(props: { matchRepository: IMatchRepository }) {
        this._matchRepository = props.matchRepository;
        this.matchExistsValidator = new MatchExistsValidator(props.matchRepository);
    }

    async handle(command: MarkMatchCompletedCommand): Promise<MarkMatchCompletedCommandResult> {
        const matchExistsResult = await this.matchExistsValidator.validate({ id: command.id });
        if (matchExistsResult.isErr()) {
            return err(matchExistsResult.error);
        }

        const match = matchExistsResult.value;

        const markingResult = MatchDomainService.canMarkCompleted(match, { endDate: command.endDate });
        if (markingResult.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({ message: markingResult.error, code: APPLICATION_ERROR_CODES.NotAllowed, path: [] }));
        }

        MatchDomainService.executeMarkCompleted(match, { endDate: command.endDate });
        await this._matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

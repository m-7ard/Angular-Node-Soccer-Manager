import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import MatchDomainService from "domain/domainService/MatchDomainService";

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

    constructor(props: { matchRepository: IMatchRepository; }) {
        this._matchRepository = props.matchRepository;
    }

    async handle(command: MarkMatchCompletedCommand): Promise<MarkMatchCompletedCommandResult> {
        const match = await this._matchRepository.getByIdAsync(command.id);
        if (match == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({ message: `Match of id "${command.id}" does not exist.`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["_"] }),
            )
        }

        const markingResult = MatchDomainService.tryMarkCompleted(match, { endDate: command.endDate });
        if (markingResult.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(markingResult.error));
        }

        await this._matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

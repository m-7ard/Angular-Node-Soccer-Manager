import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import MatchDomainService from "domain/domainService/MatchDomainService";

type CommandProps = {
    id: string;
};

export type MarkMatchCancelledCommandResult = ICommandResult<IApplicationError[]>;

export class MarkMatchCancelledCommand implements ICommand<MarkMatchCancelledCommandResult>, CommandProps {
    __returnType: MarkMatchCancelledCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
    }

    id: string;
}

export default class MarkMatchCancelledCommandHandler implements IRequestHandler<MarkMatchCancelledCommand, MarkMatchCancelledCommandResult> {
    private readonly _matchRepository: IMatchRepository;

    constructor(props: { matchRepository: IMatchRepository }) {
        this._matchRepository = props.matchRepository;
    }

    async handle(command: MarkMatchCancelledCommand): Promise<MarkMatchCancelledCommandResult> {
        const match = await this._matchRepository.getByIdAsync(command.id);
        if (match == null) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Match of id "${command.id}" does not exist.`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["_"] }));
        }

        const markingResult = MatchDomainService.tryMarkCancelled(match);
        if (markingResult.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(markingResult.error));
        }

        await this._matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

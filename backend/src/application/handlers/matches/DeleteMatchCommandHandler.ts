import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import MatchExistsValidator from "application/services/MatchExistsValidator";
import IApplicationError from "application/errors/IApplicationError";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

type CommandProps = {
    id: string;
};

export type DeleteMatchCommandResult = ICommandResult<IApplicationError[]>;

export class DeleteMatchCommand implements ICommand<DeleteMatchCommandResult>, CommandProps {
    __returnType: DeleteMatchCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
    }

    id: string;
}

export default class DeleteMatchCommandHandler implements IRequestHandler<DeleteMatchCommand, DeleteMatchCommandResult> {
    private readonly _matchRepository: IMatchRepository;
    private readonly matchExistsValidator: MatchExistsValidator;

    constructor(props: { matchRepository: IMatchRepository; matchExistsValidator: MatchExistsValidator; }) {
        this._matchRepository = props.matchRepository;
        this.matchExistsValidator = props.matchExistsValidator;
    }

    async handle(command: DeleteMatchCommand): Promise<DeleteMatchCommandResult> {
        const matchExistsResult = await this.matchExistsValidator.validate({ id: command.id });
        if (matchExistsResult.isErr()) {
            return err(matchExistsResult.error);
        }

        const match = matchExistsResult.value;
        if (match.events.length) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Cannot delete match while it has Match Events associated with it.`, code: APPLICATION_ERROR_CODES.NotAllowed, path: [] }))
        }

        await this._matchRepository.deleteAsync(match);
        return ok(undefined);
    }
}

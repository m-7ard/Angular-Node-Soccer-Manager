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
    private readonly matchExistsValidator: MatchExistsValidator;

    constructor(props: { matchRepository: IMatchRepository }) {
        this._matchRepository = props.matchRepository;
        this.matchExistsValidator = new MatchExistsValidator(props.matchRepository);
    }

    async handle(command: MarkMatchCancelledCommand): Promise<MarkMatchCancelledCommandResult> {
        const matchExistsResult = await this.matchExistsValidator.validate({ id: command.id });
        if (matchExistsResult.isErr()) {
            return err(matchExistsResult.error);
        }

        const match = matchExistsResult.value;

        const markingResult = MatchDomainService.canMarkCancelled(match);
        if (markingResult.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({
                message: markingResult.error,
                path: [],
                code: APPLICATION_ERROR_CODES.NotAllowed
            }));
        }

        MatchDomainService.executeMarkCancelled(match);
        await this._matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

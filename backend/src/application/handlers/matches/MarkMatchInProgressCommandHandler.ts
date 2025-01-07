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
    startDate: Date;
};

export type MarkMatchInProgressCommandResult = ICommandResult<IApplicationError[]>;

export class MarkMatchInProgressCommand implements ICommand<MarkMatchInProgressCommandResult>, CommandProps {
    __returnType: MarkMatchInProgressCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
        this.startDate = props.startDate;
    }

    id: string;
    startDate: Date;
}

export default class MarkMatchInProgressCommandHandler implements IRequestHandler<MarkMatchInProgressCommand, MarkMatchInProgressCommandResult> {
    private readonly _matchRepository: IMatchRepository;    
    private readonly matchExistsValidator: MatchExistsValidator;

    constructor(props: { matchRepository: IMatchRepository; }) {
        this._matchRepository = props.matchRepository;        
        this.matchExistsValidator = new MatchExistsValidator(props.matchRepository);
    }

    async handle(command: MarkMatchInProgressCommand): Promise<MarkMatchInProgressCommandResult> {
        const matchExistsResult = await this.matchExistsValidator.validate({ id: command.id });
        if (matchExistsResult.isErr()) {
            return err(matchExistsResult.error);
        }

        const match = matchExistsResult.value;

        const markingResult = MatchDomainService.canMarkInProgress(match, { startDate: command.startDate });
        if (markingResult.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({
                message: markingResult.error,
                path: [],
                code: APPLICATION_ERROR_CODES.NotAllowed
            }));
        }

        MatchDomainService.executeMarkInProgress(match, { startDate: command.startDate });
        await this._matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

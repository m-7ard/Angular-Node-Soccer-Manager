import IMatchRepository from "application/interfaces/IMatchRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import { err, ok } from "neverthrow";
import ICommand, { ICommandResult } from "../ICommand";
import { IRequestHandler } from "../IRequestHandler";
import MatchExistsValidator from "application/services/MatchExistsValidator";
import TeamId from "domain/valueObjects/Team/TeamId";
import IApplicationError from "application/errors/IApplicationError";
import { IAddGoalServiceFactory } from "application/interfaces/IAddGoalService";
import PlayerId from "domain/valueObjects/Player/PlayerId";

type CommandProps = {
    id: string;
    teamId: string;
    playerId: string;
    dateOccured: Date;
};

export type RecordGoalCommandResult = ICommandResult<IApplicationError[]>;

export class RecordGoalCommand implements ICommand<RecordGoalCommandResult>, CommandProps {
    __returnType: RecordGoalCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
        this.teamId = props.teamId;
        this.playerId = props.playerId;
        this.dateOccured = props.dateOccured;
    }

    id: string;
    teamId: string;
    playerId: string;
    dateOccured: Date;
}

export default class RecordGoalCommandHandler implements IRequestHandler<RecordGoalCommand, RecordGoalCommandResult> {
    private readonly matchRepository: IMatchRepository;
    private readonly matchExistsValidator: MatchExistsValidator;
    private readonly addGoalServiceFactory: IAddGoalServiceFactory;

    constructor(props: { matchRepository: IMatchRepository; matchExistsValidator: MatchExistsValidator; addGoalServiceFactory: IAddGoalServiceFactory; }) {
        this.matchRepository = props.matchRepository;
        this.matchExistsValidator = props.matchExistsValidator;
        this.addGoalServiceFactory = props.addGoalServiceFactory;
    }

    async handle(command: RecordGoalCommand): Promise<RecordGoalCommandResult> {
        // Match Exists
        const matchExistsResult = await this.matchExistsValidator.validate({ id: command.id });
        if (matchExistsResult.isErr()) {
            return err(matchExistsResult.error);
        }

        const match = matchExistsResult.value;
        
        const addGoalservice = this.addGoalServiceFactory.create(match);
        const addGoalResult = await addGoalservice.tryAddGoal({ dateOccured: command.dateOccured, playerId: PlayerId.executeCreate(command.playerId), teamId: TeamId.executeCreate(command.teamId) })
        if (addGoalResult.isErr()) {
            return err(addGoalResult.error);
        }

        MatchDomainService.verifyIntegrity(match);
        await this.matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

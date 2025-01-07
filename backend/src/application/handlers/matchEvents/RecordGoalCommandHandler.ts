import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import { err, ok } from "neverthrow";
import ICommand, { ICommandResult } from "../ICommand";
import { IRequestHandler } from "../IRequestHandler";
import MatchExistsValidator from "application/validators/MatchExistsValidator";
import IsMatchTeamValidator from "application/validators/IsMatchTeamValidator";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import IsTeamMemberValidator from "application/validators/IsTeamMemberValidator";
import path from "path";
import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import CanAddGoalValidator from "application/validators/CanAddGoalValidator";
import IsValidGoalValidator from "application/validators/IsValidGoalValidator";

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
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository }) {
        this.matchRepository = props.matchRepository;
        this.matchExistsValidator = new MatchExistsValidator(props.matchRepository);
        this.teamExistsValidator = new TeamExistsValidator(props.teamRepository);
    }

    async handle(command: RecordGoalCommand): Promise<RecordGoalCommandResult> {
        const matchExistsResult = await this.matchExistsValidator.validate({ id: command.id });
        if (matchExistsResult.isErr()) {
            return err(matchExistsResult.error);
        }

        const match = matchExistsResult.value;
        const isMatchTeamValidator = new IsMatchTeamValidator(match);
        const isMatchTeamResult = isMatchTeamValidator.validate({ teamId: command.teamId });
        if (isMatchTeamResult.isErr()) {
            return err(isMatchTeamResult.error);
        }

        const goalTeamExistsResult = await this.teamExistsValidator.validate({ id: command.teamId });
        if (goalTeamExistsResult.isErr()) {
            return err(goalTeamExistsResult.error);
        }

        const homeTeamExistsResult = await this.teamExistsValidator.validate({ id: match.homeTeamId });
        if (homeTeamExistsResult.isErr()) {
            return err(homeTeamExistsResult.error);
        }

        const awayTeamExistsResult = await this.teamExistsValidator.validate({ id: match.awayTeamId });
        if (awayTeamExistsResult.isErr()) {
            return err(awayTeamExistsResult.error);
        }

        const homeTeam = homeTeamExistsResult.value;
        const awayTeam = awayTeamExistsResult.value;

        const isValidGoalValidator = new IsValidGoalValidator(homeTeam, awayTeam);
        const isValidGoalResult = isValidGoalValidator.validate({ dateOccured: command.dateOccured, playerId: command.playerId, teamId: command.teamId });
        if (isValidGoalResult.isErr()) {
            return err(isValidGoalResult.error);
        }

        const canAddGoalValidator = new CanAddGoalValidator(match);
        const canAddGoalResult = canAddGoalValidator.validate({ dateOccured: command.dateOccured, playerId: command.playerId, teamId: command.teamId });
        if (canAddGoalResult.isErr()) {
            return err(canAddGoalResult.error);
        }

        match.executeAddGoal({ dateOccured: command.dateOccured, teamId: command.teamId, playerId: command.playerId });
        MatchDomainService.verifyIntegrity(match);
        await this.matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

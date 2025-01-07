import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import IUidRecord from "api/interfaces/IUidRecord";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import IsValidGoalValidator from "application/validators/IsValidGoalValidator";
import IsValidMatchDatesValidator from "application/validators/IsValidMatchDateValidator";
import MatchFactory from "domain/domainFactories/MatchFactory";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import CanAddGoalValidator from "application/validators/CanAddGoalValidator";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

type CommandProps = {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    goals: IUidRecord<{ dateOccured: Date; teamId: string; playerId: string }> | null;
};

export type CreateMatchCommandResult = ICommandResult<IApplicationError[]>;

export class CreateMatchCommand implements ICommand<CreateMatchCommandResult>, CommandProps {
    __returnType: CreateMatchCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
        this.homeTeamId = props.homeTeamId;
        this.awayTeamId = props.awayTeamId;
        this.venue = props.venue;
        this.scheduledDate = props.scheduledDate;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.status = props.status;
        this.goals = props.goals;
    }

    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    goals: IUidRecord<{ dateOccured: Date; teamId: string; playerId: string }> | null;
}

export default class CreateMatchCommandHandler implements IRequestHandler<CreateMatchCommand, CreateMatchCommandResult> {
    private readonly _matchRepository: IMatchRepository;
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository; playerRepository: IPlayerRepository }) {
        this._matchRepository = props.matchRepository;
        this.teamExistsValidator = new TeamExistsValidator(props.teamRepository);
    }

    async handle(command: CreateMatchCommand): Promise<CreateMatchCommandResult> {
        const homeTeamExistsResult = await this.teamExistsValidator.validate({ id: command.homeTeamId });
        if (homeTeamExistsResult.isErr()) {
            return err(homeTeamExistsResult.error);
        }

        const awayTeamExistsResult = await this.teamExistsValidator.validate({ id: command.awayTeamId });
        if (awayTeamExistsResult.isErr()) {
            return err(awayTeamExistsResult.error);
        }

        const homeTeam = homeTeamExistsResult.value;
        const awayTeam = awayTeamExistsResult.value;

        const isValidMatchDatesValidator = new IsValidMatchDatesValidator();
        const isValidMatchDatesResult = isValidMatchDatesValidator.validate({
            scheduledDate: command.scheduledDate,
            startDate: command.startDate,
            endDate: command.endDate,
        });

        if (isValidMatchDatesResult.isErr()) {
            return err(isValidMatchDatesResult.error);
        }

        const match = MatchFactory.CreateNew({
            id: command.id,
            homeTeamId: command.homeTeamId,
            awayTeamId: command.awayTeamId,
            venue: command.venue,
            matchDates: MatchDates.executeCreate({
                scheduledDate: command.scheduledDate,
                startDate: command.startDate,
                endDate: command.endDate,
            }),
            status: MatchStatus.executeCreate(command.status),
        });

        if (command.goals != null) {
            match.score = MatchScore.ZeroScore;
            const allGoalsErrors: IApplicationError[] = [];

            Object.entries(command.goals).forEach(([UID, goal]) => {
                const goalErrors: IApplicationError[] = [];

                const isValidGoalValidator = new IsValidGoalValidator(homeTeam, awayTeam);
                const isValidGoalResult = isValidGoalValidator.validate(goal);
                if (isValidGoalResult.isErr()) {
                    goalErrors.push(...isValidGoalResult.error);
                }

                const canAddGoalValidator = new CanAddGoalValidator(match);
                const canAddGoalResult = canAddGoalValidator.validate(goal);
                if (canAddGoalResult.isErr()) {
                    goalErrors.push(...canAddGoalResult.error);
                }

                goalErrors.forEach((error) => {
                    error.path = [UID, ...error.path];
                });
            });

            if (allGoalsErrors.length) {
                return err(allGoalsErrors);
            }

            Object.values(command.goals).forEach((goal) => match.executeAddGoal(goal));
        }

        try {
            MatchDomainService.verifyIntegrity(match);
        } catch (error) {
            if (typeof error === "string") {
                return err(
                    ApplicationErrorFactory.createSingleListError({
                        message: error,
                        path: [],
                        code: APPLICATION_ERROR_CODES.IntegrityError,
                    }),
                );
            }
        }

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }
}

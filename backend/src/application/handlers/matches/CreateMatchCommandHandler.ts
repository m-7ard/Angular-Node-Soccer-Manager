import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import IUidRecord from "api/interfaces/IUidRecord";
import IsValidGoalValidator from "application/services/IsValidGoalValidator";
import IsValidMatchDatesValidator from "application/services/IsValidMatchDateValidator";
import MatchFactory from "domain/domainFactories/MatchFactory";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import AddGoalService from "application/services/CanAddGoalValidator";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamValidator from "application/interfaces/ITeamValidator";
import TeamId from "domain/valueObjects/Team/TeamId";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import IApplicationError from "application/errors/IApplicationError";
import { IAddGoalServiceFactory } from "application/interfaces/IAddGoalService";
import Player from "domain/entities/Player";

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
    private readonly teamExistsValidator: ITeamValidator<TeamId>;
    private readonly addGoalServiceFactory: IAddGoalServiceFactory;

    constructor(props: { matchRepository: IMatchRepository; teamExistsValidator: ITeamValidator<TeamId>; addGoalServiceFactory: IAddGoalServiceFactory }) {
        this._matchRepository = props.matchRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.addGoalServiceFactory = props.addGoalServiceFactory;
    }

    async handle(command: CreateMatchCommand): Promise<CreateMatchCommandResult> {
        const homeTeamId = TeamId.executeCreate(command.homeTeamId);
        const homeTeamExistsResult = await this.teamExistsValidator.validate(homeTeamId);
        if (homeTeamExistsResult.isErr()) {
            return err(homeTeamExistsResult.error);
        }

        const awayTeamId = TeamId.executeCreate(command.awayTeamId);
        const awayTeamExistsResult = await this.teamExistsValidator.validate(awayTeamId);
        if (awayTeamExistsResult.isErr()) {
            return err(awayTeamExistsResult.error);
        }

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
            homeTeamId: awayTeamId,
            awayTeamId: homeTeamId,
            venue: command.venue,
            matchDates: MatchDates.executeCreate({
                scheduledDate: command.scheduledDate,
                startDate: command.startDate,
                endDate: command.endDate,
            }),
            status: MatchStatus.executeCreate(command.status),
        });

        // Add Goals
        if (command.goals != null) {
            match.score = MatchScore.ZeroScore;
            const allGoalsErrors: IApplicationError[] = [];
            const goalEntries = Object.entries(command.goals);
            const addGoalService = this.addGoalServiceFactory.create(match);

            for (let i = 0; i < goalEntries.length; i++) {
                const [UID, goal] = goalEntries[i];
                const goalEntryErrors: IApplicationError[] = [];

                const addGoalResult = await addGoalService.tryAddGoal({ dateOccured: goal.dateOccured, playerId: PlayerId.executeCreate(goal.playerId), teamId: TeamId.executeCreate(goal.teamId) });
                if (addGoalResult.isErr()) {
                    goalEntryErrors.push(...addGoalResult.error);
                }

                goalEntryErrors.forEach((error) => {
                    error.path = [UID, ...error.path];
                });
            }

            if (allGoalsErrors.length) {
                return err(allGoalsErrors);
            }
        }

        // Check Integrity
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

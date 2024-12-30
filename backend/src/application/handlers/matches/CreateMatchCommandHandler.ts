import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import MatchFactory from "domain/domainFactories/MatchFactory";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import ITeamRepository from "application/interfaces/ITeamRepository";

type CommandProps = {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startTime: Date;
    endTime: Date | null;
    status: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
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
        this.startTime = props.startTime;
        this.endTime = props.endTime;
        this.status = props.status;
        this.homeTeamScore = props.homeTeamScore;
        this.awayTeamScore = props.awayTeamScore;
    }

    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startTime: Date;
    endTime: Date | null;
    status: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
}

export default class CreateMatchCommandHandler implements IRequestHandler<CreateMatchCommand, CreateMatchCommandResult> {
    private readonly _matchRepository: IMatchRepository;
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository }) {
        this._matchRepository = props.matchRepository;
        this._teamRepository = props.teamRepository;
    }

    async handle(command: CreateMatchCommand): Promise<CreateMatchCommandResult> {
        const match = MatchFactory.CreateNew({
            id: command.id,
            homeTeamId: command.homeTeamId,
            awayTeamId: command.awayTeamId,
            venue: command.venue,
            scheduledDate: command.scheduledDate,
            startTime: command.startTime,
        });

        const statusResult = match.trySetStatus(command.status);
        if (statusResult.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(statusResult.error));
        }

        if (match.status === MatchStatus.COMPLETED) {
            if (command.endTime == null) {
                return err(
                    ApplicationErrorFactory.createSingleListError({
                        message: `A completed match cannot have a null endTime.`,
                        code: VALIDATION_ERROR_CODES.StateMismatch,
                        path: ["endTime"],
                    }),
                );
            }

            const endTimeResult = match.trySetEndTime(command.endTime);
            if (endTimeResult.isErr()) {
                return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(endTimeResult.error));
            }
        }

        if (match.canHaveScore()) {
            if (command.homeTeamScore == null) {
                return err(
                    ApplicationErrorFactory.createSingleListError({
                        message: `Home Team Score cannot be null when status is ${match.status.value}.`,
                        code: VALIDATION_ERROR_CODES.StateMismatch,
                        path: ["homeTeamScore"],
                    }),
                );
            }
    
            if (command.awayTeamScore == null) {
                return err(
                    ApplicationErrorFactory.createSingleListError({
                        message: `Away Team Score cannot be null when status is ${match.status.value}.`,
                        code: VALIDATION_ERROR_CODES.StateMismatch,
                        path: ["awayTeamScore"],
                    }),
                );
            }
    
            const scoreResult = match.trySetScore({ homeTeamScore: command.homeTeamScore, awayTeamScore: command.awayTeamScore });
            if (scoreResult.isErr()) {
                return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(scoreResult.error));
            }
        }

        const homeTeam = await this._teamRepository.getByIdAsync(command.homeTeamId);
        if (homeTeam == null) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Team of id "${command.homeTeamId}" does not exist.`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["homeTeamId"] }));
        }

        const awayTeam = await this._teamRepository.getByIdAsync(command.awayTeamId);
        if (awayTeam == null) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Team of id "${command.awayTeamId}" does not exist.`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["homeTeamId"] }));
        }

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }
}

import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import { err, ok } from "neverthrow";
import ICommand, { ICommandResult } from "../ICommand";
import { IRequestHandler } from "../IRequestHandler";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";

type CommandProps = {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
};

export type ScheduleMatchCommandResult = ICommandResult<IApplicationError[]>;

export class ScheduleMatchCommand implements ICommand<ScheduleMatchCommandResult>, CommandProps {
    __returnType: ScheduleMatchCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
        this.homeTeamId = props.homeTeamId;
        this.awayTeamId = props.awayTeamId;
        this.venue = props.venue;
        this.scheduledDate = props.scheduledDate;
    }

    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
}

export default class ScheduleMatchCommandHandler implements IRequestHandler<ScheduleMatchCommand, ScheduleMatchCommandResult> {
    private readonly _matchRepository: IMatchRepository;
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository }) {
        this._matchRepository = props.matchRepository;
        this._teamRepository = props.teamRepository;
    }

    async handle(command: ScheduleMatchCommand): Promise<ScheduleMatchCommandResult> {
        const homeTeam = await this._teamRepository.getByIdAsync(command.homeTeamId);
        if (homeTeam == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({ message: `Team of id "${command.homeTeamId}" does not exist.`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["homeTeamId"] }),
            );
        }

        const awayTeam = await this._teamRepository.getByIdAsync(command.awayTeamId);
        if (awayTeam == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({ message: `Team of id "${command.awayTeamId}" does not exist.`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["homeTeamId"] }),
            );
        }

        const matchCreationResult = MatchDomainService.tryCreateMatch({
            id: command.id,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            venue: command.venue,
            scheduledDate: command.scheduledDate,
            startDate: null,
            endDate: null,
            status: MatchStatus.SCHEDULED.value,
            goals: null,
        });

        if (matchCreationResult.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(matchCreationResult.error));
        }

        const match = matchCreationResult.value;

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }
}

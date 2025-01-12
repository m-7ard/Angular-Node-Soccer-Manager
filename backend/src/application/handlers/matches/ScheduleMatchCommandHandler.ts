import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import { err, ok } from "neverthrow";
import ICommand, { ICommandResult } from "../ICommand";
import { IRequestHandler } from "../IRequestHandler";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import MatchFactory from "domain/domainFactories/MatchFactory";
import IsValidMatchDatesValidator from "application/validators/IsValidMatchDateValidator";
import MatchDates from "domain/valueObjects/Match/MatchDates";

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
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { matchRepository: IMatchRepository; teamExistsValidator: TeamExistsValidator }) {
        this._matchRepository = props.matchRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: ScheduleMatchCommand): Promise<ScheduleMatchCommandResult> {
        if (command.awayTeamId === command.homeTeamId) {
            return err(ApplicationErrorFactory.createSingleListError({
                message: "Away team cannot be the same team as home team.",
                path: [],
                code: APPLICATION_ERROR_CODES.IntegrityError
            }))
        }

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
            startDate: null,
            endDate: null,
        });
        if (isValidMatchDatesResult.isErr()) {
            return err(isValidMatchDatesResult.error);
        }

        console.log(command.scheduledDate);
        console.log(command.scheduledDate);
        console.log(command.scheduledDate);

        const match = MatchFactory.CreateNew({
            id: command.id,
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            venue: command.venue,
            matchDates: MatchDates.executeCreate({
                scheduledDate: command.scheduledDate,
                startDate: null,
                endDate: null,
            }),
            status: MatchStatus.SCHEDULED,
        });

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamRepository from "application/interfaces/ITeamRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";

type CommandProps = {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    score: {
        homeTeamScore: number;
        awayTeamScore: number;
    } | null;
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
        this.score = props.score;
    }

    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    score: {
        homeTeamScore: number;
        awayTeamScore: number;
    } | null;
}

export default class CreateMatchCommandHandler implements IRequestHandler<CreateMatchCommand, CreateMatchCommandResult> {
    private readonly _matchRepository: IMatchRepository;
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository }) {
        this._matchRepository = props.matchRepository;
        this._teamRepository = props.teamRepository;
    }

    async handle(command: CreateMatchCommand): Promise<CreateMatchCommandResult> {
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
            startDate: command.startDate,
            endDate: command.endDate,
            status: command.status,
            score: command.score,
        });

        if (matchCreationResult.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(matchCreationResult.error));
        }

        const match = matchCreationResult.value;

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }
}

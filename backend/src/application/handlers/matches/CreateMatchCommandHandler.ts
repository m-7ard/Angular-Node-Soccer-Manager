import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok, Result } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamRepository from "application/interfaces/ITeamRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import IUidRecord from "api/interfaces/IUidRecord";
import Player from "domain/entities/Player";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import Team from "domain/entities/Team";

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
    private readonly _teamRepository: ITeamRepository;
    private readonly _playerRepository: IPlayerRepository;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository; playerRepository: IPlayerRepository }) {
        this._matchRepository = props.matchRepository;
        this._teamRepository = props.teamRepository;
        this._playerRepository = props.playerRepository;
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

        if (command.goals != null) {
            const goalsResult = await this.tryProcessGoals({ goals: command.goals, homeTeam: homeTeam, awayTeam: awayTeam });
            if (goalsResult.isErr()) {
                return err(goalsResult.error);
            }
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
            goals: command.goals,
        });

        if (matchCreationResult.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(matchCreationResult.error));
        }

        const match = matchCreationResult.value;

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }

    private async tryProcessGoals(props: { goals: NonNullable<CommandProps["goals"]>; homeTeam: Team; awayTeam: Team }): Promise<Result<true, IApplicationError[]>> {
        const { goals, homeTeam, awayTeam } = props;

        const playerErrors: IApplicationError[] = [];
        const players: { [key: Player["id"]]: Player | null } = {};
        for (const [UID, goal] of Object.entries(goals)) {
            const player = players.hasOwnProperty(goal.playerId) ? players[goal.playerId] : await this._playerRepository.getByIdAsync(goal.playerId);

            players[goal.playerId] = player;

            if (player == null) {
                playerErrors.push({ message: `Player of id "${goal.playerId}" does not exist`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["goals", UID, "playerId"] });
            } else {
                const memebership = awayTeam.findMemberByPlayerId(player.id) ?? homeTeam.findMemberByPlayerId(player.id);
                if (memebership == null) {
                    playerErrors.push({ message: `Player of id "${player.id}" does not exist on match teams`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["goals", UID, "playerId"] });
                }
            }
        }

        if (playerErrors.length) {
            return err(playerErrors);
        }

        return ok(true);
    }
}

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
    private readonly _matchRepository: IMatchRepository;
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository }) {
        this._matchRepository = props.matchRepository;
        this._teamRepository = props.teamRepository;
    }

    async handle(command: RecordGoalCommand): Promise<RecordGoalCommandResult> {
        const match = await this._matchRepository.getByIdAsync(command.teamId);
        if (match == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                    message: `Match of id "${command.id}" does not exist.`,
                    path: ["_"],
                }),
            );
        }

        if (!match.canHaveScore()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.StateMismatch,
                    message: `Cannot record a goal on a match that cannot have a score.`,
                    path: ["_"],
                }),
            );
        }

        const isMatchTeam = command.teamId === match.awayTeamId || command.teamId === match.homeTeamId;
        if (!isMatchTeam) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.StateMismatch,
                    message: `Team of id "${command.teamId}" is not part of the match.`,
                    path: ["teamId"],
                }),
            );
        }

        const team = await this._teamRepository.getByIdAsync(command.teamId);
        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.StateMismatch,
                    message: `Team of id "${command.teamId}" does not exist.`,
                    path: ["teamId"],
                }),
            );
        }

        const membership = team.findMemberByPlayerId(command.playerId);
        if (membership == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.IntegrityError,
                    message: `Player of id "${command.playerId}" does not exist on team of id "${command.teamId}".`,
                    path: ["playerId"],
                }),
            );
        }

        const addGoalResult = match.tryAddGoal({ dateOccured: command.dateOccured, teamId: command.teamId, playerId: command.playerId });
        if (addGoalResult.isErr()) {
            return err(addGoalResult.error);
        }

        const integrityResult = MatchDomainService.tryVerifyIntegrity(match);
        if (integrityResult.isErr()) {
            return err(integrityResult.error);
        }

        await this._matchRepository.updateAsync(match);
        return ok(undefined);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import ITeamRepository from "application/interfaces/ITeamRepository";
import MatchDomainService from "domain/domainService/MatchDomainService";
import IUidRecord from "api/interfaces/IUidRecord";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import PlayerExistsValidator from "application/validators/PlayerExistsValidator";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import IsValidGoalValidator from "application/validators/IsValidGoalValidator";

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
    private readonly playerExistsValidator: PlayerExistsValidator;
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository; playerRepository: IPlayerRepository }) {
        this._matchRepository = props.matchRepository;
        this._teamRepository = props.teamRepository;
        this._playerRepository = props.playerRepository;
        this.playerExistsValidator = new PlayerExistsValidator(props.playerRepository);
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
        const isValidGoalValidator = new IsValidGoalValidator(homeTeam, awayTeam);

        if (command.goals != null) {
            const errors: IApplicationError[] = [];
            Object.entries(command.goals).forEach(([UID, goal]) => {
                const isValidGoalResult = isValidGoalValidator.validate(goal);
                if (isValidGoalResult.isErr()) {
                    errors.push(...isValidGoalResult.error.map((error) => ({ ...error, path: [UID] })));
                }
            });

            if (errors.length) {
                return err(errors);
            }
        }

        const matchCreationResult = MatchDomainService.canCreateMatch({
            id: command.id,
            homeTeam: homeTeamExistsResult.value,
            awayTeam: awayTeamExistsResult.value,
            venue: command.venue,
            scheduledDate: command.scheduledDate,
            startDate: command.startDate,
            endDate: command.endDate,
            status: command.status,
            goals: command.goals == null ? null : Object.values(command.goals),
        });

        if (matchCreationResult.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors(matchCreationResult.error));
        }

        const match = matchCreationResult.value;

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }
}

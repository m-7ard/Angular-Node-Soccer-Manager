import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

export type CreateTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class CreateTeamMembershipCommand implements ICommand<CreateTeamMembershipCommandResult> {
    __returnType: CreateTeamMembershipCommandResult = null!;

    constructor({ teamId, playerId, activeFrom, activeTo, number }: { teamId: string; playerId: string; activeFrom: Date; activeTo: Date | null; number: number }) {
        this.teamId = teamId;
        this.playerId = playerId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
        this.number = number;
    }

    public teamId: string;
    public playerId: string;
    public activeFrom: Date;
    public activeTo: Date | null;
    public number: number;
}

export default class CreateTeamMembershipCommandHandler implements IRequestHandler<CreateTeamMembershipCommand, CreateTeamMembershipCommandResult> {
    private readonly _playerRepository: IPlayerRepository;
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { playerRepository: IPlayerRepository; teamRepository: ITeamRepository }) {
        this._playerRepository = props.playerRepository;
        this._teamRepository = props.teamRepository;
    }

    async handle(command: CreateTeamMembershipCommand): Promise<CreateTeamMembershipCommandResult> {
        const team = await this._teamRepository.getByIdAsync(command.teamId);
        if (team == null) {
            return err([
                {
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                    path: ["_"],
                    message: `Team with id ${command.teamId} does not exist.`,
                },
            ]);
        }

        const player = await this._playerRepository.getByIdAsync(command.playerId);
        if (player == null) {
            return err([
                {
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                    path: ["_"],
                    message: `Player with id ${command.teamId} does not exist.`,
                },
            ]);
        }

        const memberAdded = team.tryAddMember({ playerId: player.id, activeFrom: command.activeFrom, activeTo: command.activeTo, number: command.number });
        if (memberAdded.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors([memberAdded.error]));
        }

        this._teamRepository.updateAsync(team);

        return ok(undefined);
    }
}

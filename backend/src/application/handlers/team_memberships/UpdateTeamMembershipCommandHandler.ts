import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import IsTeamMemberValidator from "application/validators/IsTeamMemberValidator";
import PlayerExistsValidator from "application/validators/PlayerExistsValidator";

export type UpdateTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class UpdateTeamMembershipCommand implements ICommand<UpdateTeamMembershipCommandResult> {
    __returnType: UpdateTeamMembershipCommandResult = null!;

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

export default class UpdateTeamMembershipCommandHandler implements IRequestHandler<UpdateTeamMembershipCommand, UpdateTeamMembershipCommandResult> {
    private readonly _teamRepository: ITeamRepository;
    private readonly teamExistsValidator: TeamExistsValidator;
    private readonly playerExistsValidator: PlayerExistsValidator;

    constructor(props: { teamRepository: ITeamRepository, teamExistsValidator: TeamExistsValidator; playerExistsValidator: PlayerExistsValidator; }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.playerExistsValidator = props.playerExistsValidator;
    }

    async handle(command: UpdateTeamMembershipCommand): Promise<UpdateTeamMembershipCommandResult> {
        const teamExistsResult = await this.teamExistsValidator.validate({ id: command.teamId });
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        const playerExistsResult = await this.playerExistsValidator.validate({ id: command.playerId });
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const player = playerExistsResult.value;

        const isTeamMemberValidator = new IsTeamMemberValidator();
        const isTeamMemberResult = isTeamMemberValidator.validate({ team: teamExistsResult.value, playerId: command.playerId });
        if (isTeamMemberResult.isErr()) {
            return err(isTeamMemberResult.error);
        }

        const canUpdateTeamMembershipResult = team.canUpdateMember(player, { activeFrom: command.activeFrom, activeTo: command.activeTo, number: command.number });
        if (canUpdateTeamMembershipResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canUpdateTeamMembershipResult.error,
                    path: [],
                    code: APPLICATION_ERROR_CODES.NotAllowed,
                }),
            );
        }

        team.executeUpdateMember(player, { activeFrom: command.activeFrom, activeTo: command.activeTo, number: command.number });
        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

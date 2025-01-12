import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import PlayerExistsValidator from "application/validators/PlayerExistsValidator";
import CanAddTeamMembershipValidator from "application/validators/CanAddTeamMembershipValidator";

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
    private readonly _teamRepository: ITeamRepository;
    private readonly teamExistsValidator: TeamExistsValidator;
    private readonly playerExistsValidator: PlayerExistsValidator;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: TeamExistsValidator; playerExistsValidator: PlayerExistsValidator }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.playerExistsValidator = props.playerExistsValidator;
    }

    async handle(command: CreateTeamMembershipCommand): Promise<CreateTeamMembershipCommandResult> {
        const teamExistsResult = await this.teamExistsValidator.validate({ id: command.teamId });
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const playerExistsResult = await this.playerExistsValidator.validate({ id: command.playerId });
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const team = teamExistsResult.value;
        const player = playerExistsResult.value;

        const canAddTeamMembershipValidator = new CanAddTeamMembershipValidator();
        const canAddTeamMembershipResult = canAddTeamMembershipValidator.validate({
            team: team,
            player: player,
            activeFrom: command.activeFrom,
            activeTo: command.activeTo,
            number: command.number,
        });
        if (canAddTeamMembershipResult.isErr()) {
            return err(canAddTeamMembershipResult.error);
        }

        team.executeAddMember({ player: player, activeFrom: command.activeFrom, activeTo: command.activeTo, number: command.number });
        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import PlayerExistsValidator from "application/validators/PlayerExistsValidator";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamValidator from "application/interfaces/ITeamValidaror";
import TeamId from "domain/valueObjects/Team/TeamId";

interface Props {
    teamId: string;
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
    number: number;
    position: string;
    dateEffectiveFrom: Date;
}

export type CreateTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class CreateTeamMembershipCommand implements ICommand<CreateTeamMembershipCommandResult>, Props {
    __returnType: CreateTeamMembershipCommandResult = null!;

    constructor({ teamId, playerId, activeFrom, activeTo, number, position, dateEffectiveFrom }: Props) {
        this.teamId = teamId;
        this.playerId = playerId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
        this.number = number;
        this.position = position;
        this.dateEffectiveFrom = dateEffectiveFrom;
    }

    public teamId: string;
    public playerId: string;
    public activeFrom: Date;
    public activeTo: Date | null;
    public number: number;
    public position: string;
    public dateEffectiveFrom: Date;
}

export default class CreateTeamMembershipCommandHandler implements IRequestHandler<CreateTeamMembershipCommand, CreateTeamMembershipCommandResult> {
    private readonly _teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;
    private readonly playerExistsValidator: PlayerExistsValidator;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId>; playerExistsValidator: PlayerExistsValidator }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.playerExistsValidator = props.playerExistsValidator;
    }

    async handle(command: CreateTeamMembershipCommand): Promise<CreateTeamMembershipCommandResult> {
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const playerExistsResult = await this.playerExistsValidator.validate({ id: command.playerId });
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const team = teamExistsResult.value;
        const player = playerExistsResult.value;

        // Add membership to team
        const canAddMembershipResult = team.canAddMember({
            player: player,
            activeFrom: command.activeFrom,
            activeTo: command.activeTo,
        });

        if (canAddMembershipResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddMembershipResult.error,
                    path: [],
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                }),
            );
        }

        const teamMembershipId = team.executeAddMember({
            player: player,
            activeFrom: command.activeFrom,
            activeTo: command.activeTo,
        });

        // Add history to membership
        const canAddTeamMembershipHistory = team.canAddHistoryToTeamMembership(teamMembershipId, { number: command.number, position: command.position, dateEffectiveFrom: command.dateEffectiveFrom });

        if (canAddTeamMembershipHistory.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddTeamMembershipHistory.error,
                    path: [],
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                }),
            );
        }

        team.executeAddHistoryToTeamMembership(teamMembershipId, { number: command.number, position: command.position, dateEffectiveFrom: command.dateEffectiveFrom });

        // Update team aggregate
        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

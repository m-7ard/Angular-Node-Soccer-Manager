import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamValidator from "application/interfaces/ITeamValidator";
import TeamId from "domain/valueObjects/Team/TeamId";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import IApplicationError from "application/errors/IApplicationError";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";

interface Props {
    id: string;
    teamId: string;
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
    number: number;
    position: string;
}

export type CreateTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class CreateTeamMembershipCommand implements ICommand<CreateTeamMembershipCommandResult>, Props {
    __returnType: CreateTeamMembershipCommandResult = null!;

    constructor({ id, teamId, playerId, activeFrom, activeTo, number, position }: Props) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
        this.number = number;
        this.position = position;
    }

    public id: string;
    public teamId: string;
    public playerId: string;
    public activeFrom: Date;
    public activeTo: Date | null;
    public number: number;
    public position: string;
}

export default class CreateTeamMembershipCommandHandler implements IRequestHandler<CreateTeamMembershipCommand, CreateTeamMembershipCommandResult> {
    private readonly _teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;
    private readonly playerExistsValidator: IPlayerValidator<PlayerId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId>; playerExistsValidator: IPlayerValidator<PlayerId> }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.playerExistsValidator = props.playerExistsValidator;
    }

    async handle(command: CreateTeamMembershipCommand): Promise<CreateTeamMembershipCommandResult> {
        // Team Exists
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        // Player Exists
        const playerExistsResult = await this.playerExistsValidator.validate(PlayerId.executeCreate(command.playerId));
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const player = playerExistsResult.value;

        // Add Team Membership to Team
        const canAddMembershipResult = team.canAddMember({
            id: command.id,
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
            id: command.id,
            player: player,
            activeFrom: command.activeFrom,
            activeTo: command.activeTo,
        });

        // Add history to membership
        const teamMembershipHistoryId = crypto.randomUUID();
        const canAddTeamMembershipHistory = team.canAddHistoryToTeamMembership(teamMembershipId, {
            id: teamMembershipHistoryId,
            number: command.number,
            position: command.position,
            dateEffectiveFrom: command.activeFrom,
        });

        if (canAddTeamMembershipHistory.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddTeamMembershipHistory.error,
                    path: [],
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                }),
            );
        }

        team.executeAddHistoryToTeamMembership(teamMembershipId, {
            id: teamMembershipHistoryId,
            number: command.number,
            position: command.position,
            dateEffectiveFrom: command.activeFrom,
        });

        // Update team aggregate
        await this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import ITeamValidator from "application/interfaces/ITeamValidator";
import TeamId from "domain/valueObjects/Team/TeamId";
import { ITeamMembershipExistsValidatorFactory } from "application/interfaces/ITeamMembershipExistsValidator";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import IApplicationError from "application/errors/IApplicationError";

export type UpdateTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class UpdateTeamMembershipCommand implements ICommand<UpdateTeamMembershipCommandResult> {
    __returnType: UpdateTeamMembershipCommandResult = null!;

    constructor({ teamId, activeFrom, activeTo, teamMembershipId }: { teamId: string; activeFrom: Date; activeTo: Date | null; teamMembershipId: string }) {
        this.teamId = teamId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
        this.teamMembershipId = teamMembershipId;
    }

    public teamId: string;
    public activeFrom: Date;
    public activeTo: Date | null;
    public teamMembershipId: string;
}

export default class UpdateTeamMembershipCommandHandler implements IRequestHandler<UpdateTeamMembershipCommand, UpdateTeamMembershipCommandResult> {
    private readonly _teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;
    private readonly playerExistsValidator: IPlayerValidator<PlayerId>;
    private readonly teamMembershipExistsValidatorFactory: ITeamMembershipExistsValidatorFactory<TeamMembershipId>;

    constructor(props: {
        teamRepository: ITeamRepository;
        teamExistsValidator: ITeamValidator<TeamId>;
        teamMembershipExistsValidatorFactory: ITeamMembershipExistsValidatorFactory<TeamMembershipId>;
        playerExistsValidator: IPlayerValidator<PlayerId>;
    }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.teamMembershipExistsValidatorFactory = props.teamMembershipExistsValidatorFactory;
        this.playerExistsValidator = props.playerExistsValidator;
    }

    async handle(command: UpdateTeamMembershipCommand): Promise<UpdateTeamMembershipCommandResult> {
        // Team Exists
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }
        const team = teamExistsResult.value;

        // Team Membership Exists
        const teamMembershipId = TeamMembershipId.executeCreate(command.teamMembershipId);
        const teamMembershipExistsValidator = this.teamMembershipExistsValidatorFactory.create(team);
        const teamMembershipExistsResult = teamMembershipExistsValidator.validate(teamMembershipId);
        if (teamMembershipExistsResult.isErr()) {
            return err(teamMembershipExistsResult.error);
        }

        const teamMembership = teamMembershipExistsResult.value;

        // Player of Team Membership Exists
        const playerExistsResult = await this.playerExistsValidator.validate(teamMembership.playerId);
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const player = playerExistsResult.value;

        // Can Update Team Membership
        const canUpdateTeamMembershipResult = team.canUpdateMember(teamMembershipId, player, { activeFrom: command.activeFrom, activeTo: command.activeTo });
        if (canUpdateTeamMembershipResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canUpdateTeamMembershipResult.error,
                    path: [],
                    code: APPLICATION_ERROR_CODES.NotAllowed,
                }),
            );
        }

        team.executeUpdateMember(teamMembershipId, player, { activeFrom: command.activeFrom, activeTo: command.activeTo });
        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

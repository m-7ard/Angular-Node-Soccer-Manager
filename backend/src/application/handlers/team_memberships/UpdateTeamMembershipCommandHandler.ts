import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import PlayerExistsValidator from "application/validators/PlayerExistsValidator";
import ITeamValidator from "application/interfaces/ITeamValidaror";
import TeamId from "domain/valueObjects/Team/TeamId";
import { ITeamMembershipExistsValidatorFactory } from "application/interfaces/ITeamMembershipExistsValidator";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamId";

export type UpdateTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class UpdateTeamMembershipCommand implements ICommand<UpdateTeamMembershipCommandResult> {
    __returnType: UpdateTeamMembershipCommandResult = null!;

    constructor({ teamId, activeFrom, activeTo, teamMembershipId }: { teamId: string; activeFrom: Date; activeTo: Date | null; number: number; teamMembershipId: string }) {
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
    private readonly teamMembershipExistsValidatorFactory: ITeamMembershipExistsValidatorFactory<TeamMembershipId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId>; teamMembershipExistsValidatorFactory: ITeamMembershipExistsValidatorFactory<TeamMembershipId> }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.teamMembershipExistsValidatorFactory = props.teamMembershipExistsValidatorFactory;
    }

    async handle(command: UpdateTeamMembershipCommand): Promise<UpdateTeamMembershipCommandResult> {
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        const teamMembershipId = TeamMembershipId.executeCreate(command.teamId);
        const teamMembershipExistsValidator = this.teamMembershipExistsValidatorFactory.create(team);
        const teamMembershipExistsResult = teamMembershipExistsValidator.validate(teamMembershipId);
        if (teamMembershipExistsResult.isErr()) {
            return err(teamMembershipExistsResult.error);
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

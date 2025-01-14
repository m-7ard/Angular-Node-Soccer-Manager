import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ITeamValidator from "application/interfaces/ITeamValidator";
import TeamId from "domain/valueObjects/Team/TeamId";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import IApplicationError from "application/errors/IApplicationError";

export type DeleteTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class DeleteTeamMembershipCommand implements ICommand<DeleteTeamMembershipCommandResult> {
    __returnType: DeleteTeamMembershipCommandResult = null!;

    constructor({ teamId, teamMembershipId }: { teamId: string; teamMembershipId: string }) {
        this.teamId = teamId;
        this.teamMembershipId = teamMembershipId;
    }

    public teamId: string;
    public teamMembershipId: string;
}

export default class DeleteTeamMembershipCommandHandler implements IRequestHandler<DeleteTeamMembershipCommand, DeleteTeamMembershipCommandResult> {
    private readonly _teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId> }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: DeleteTeamMembershipCommand): Promise<DeleteTeamMembershipCommandResult> {
        // Team Exists
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        // Can Delete Team Membership
        const teamMembershipId = TeamMembershipId.executeCreate(command.teamMembershipId);
        const canDeleteTeamMembershipResult = team.canDeleteTeamMembership(teamMembershipId);
        if (canDeleteTeamMembershipResult.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({ code: APPLICATION_ERROR_CODES.NotAllowed, message: canDeleteTeamMembershipResult.error, path: [] }));
        }

        // Delete Team Membership
        team.executeDeleteTeamMembership(teamMembershipId);

        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

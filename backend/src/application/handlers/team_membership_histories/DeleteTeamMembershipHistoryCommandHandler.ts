import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamValidator from "application/interfaces/ITeamValidator";
import TeamId from "domain/valueObjects/Team/TeamId";
import IApplicationError from "application/errors/IApplicationError";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";

interface Props {
    teamMembershipHistoryId: string;
    teamId: string;
    teamMembershipId: string;
}

export type DeleteTeamMembershipHistoryCommandResult = ICommandResult<IApplicationError[]>;

export class DeleteTeamMembershipHistoryCommand implements ICommand<DeleteTeamMembershipHistoryCommandResult>, Props {
    __returnType: DeleteTeamMembershipHistoryCommandResult = null!;

    constructor({ teamMembershipHistoryId, teamId, teamMembershipId }: Props) {
        this.teamMembershipHistoryId = teamMembershipHistoryId;
        this.teamId = teamId;
        this.teamMembershipId = teamMembershipId;
    }

    teamMembershipHistoryId: string;
    teamId: string;
    teamMembershipId: string;
}

export default class DeleteTeamMembershipHistoryCommandHandler implements IRequestHandler<DeleteTeamMembershipHistoryCommand, DeleteTeamMembershipHistoryCommandResult> {
    private readonly teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId> }) {
        this.teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: DeleteTeamMembershipHistoryCommand): Promise<DeleteTeamMembershipHistoryCommandResult> {
        // Team Exists
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        // Update Team Membership History
        const teamMembershipId = TeamMembershipId.executeCreate(command.teamMembershipId);
        const teamMembershipHistoryId = TeamMembershipHistoryId.executeCreate(command.teamMembershipHistoryId);

        const canRemoveTeamMembershipHistoryResult = team.canRemoveHistoryFromTeamMembership(teamMembershipId, teamMembershipHistoryId);
        if (canRemoveTeamMembershipHistoryResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canRemoveTeamMembershipHistoryResult.error,
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                    path: [],
                }),
            );
        }

        team.executeRemoveHistoryFromTeamMembership(teamMembershipId, teamMembershipHistoryId);

        // Update team aggregate
        await this.teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

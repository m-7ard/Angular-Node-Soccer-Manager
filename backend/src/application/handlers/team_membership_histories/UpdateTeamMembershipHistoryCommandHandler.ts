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
    dateEffectiveFrom: Date;
    number: number;
    position: string;
}

export type UpdateTeamMembershipHistoryCommandResult = ICommandResult<IApplicationError[]>;

export class UpdateTeamMembershipHistoryCommand implements ICommand<UpdateTeamMembershipHistoryCommandResult>, Props {
    __returnType: UpdateTeamMembershipHistoryCommandResult = null!;

    constructor({ teamMembershipHistoryId, teamId, teamMembershipId, dateEffectiveFrom, number, position }: Props) {
        this.teamMembershipHistoryId = teamMembershipHistoryId;
        this.teamId = teamId;
        this.teamMembershipId = teamMembershipId;
        this.dateEffectiveFrom = dateEffectiveFrom;
        this.number = number;
        this.position = position;
    }

    teamMembershipHistoryId: string;
    teamId: string;
    teamMembershipId: string;
    dateEffectiveFrom: Date;
    number: number;
    position: string;
}

export default class UpdateTeamMembershipHistoryCommandHandler implements IRequestHandler<UpdateTeamMembershipHistoryCommand, UpdateTeamMembershipHistoryCommandResult> {
    private readonly teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId> }) {
        this.teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: UpdateTeamMembershipHistoryCommand): Promise<UpdateTeamMembershipHistoryCommandResult> {
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
        const canUpdateTeamMembershipHistoryResult = team.canUpdateTeamMembershipHistory(teamMembershipId, teamMembershipHistoryId, {
            number: command.number,
            position: command.position,
            dateEffectiveFrom: command.dateEffectiveFrom,
        });
        if (canUpdateTeamMembershipHistoryResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canUpdateTeamMembershipHistoryResult.error,
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                    path: [],
                }),
            );
        }

        team.executeUpdateTeamMembershipHistory(teamMembershipId, teamMembershipHistoryId, { number: command.number, position: command.position, dateEffectiveFrom: command.dateEffectiveFrom });

        // Update team aggregate
        await this.teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

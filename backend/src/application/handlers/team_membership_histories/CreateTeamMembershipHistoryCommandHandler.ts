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
    id: string;
    teamId: string;
    teamMembershipId: string;
    dateEffectiveFrom: Date;
    number: number;
    position: string;
}

export type CreateTeamMembershipHistoryCommandResult = ICommandResult<IApplicationError[]>;

export class CreateTeamMembershipHistoryCommand implements ICommand<CreateTeamMembershipHistoryCommandResult>, Props {
    __returnType: CreateTeamMembershipHistoryCommandResult = null!;

    constructor({ id, teamId, teamMembershipId, dateEffectiveFrom, number, position }: Props) {
        this.id = id;
        this.teamId = teamId;
        this.teamMembershipId = teamMembershipId;
        this.dateEffectiveFrom = dateEffectiveFrom;
        this.number = number;
        this.position = position;
    }

    id: string;
    teamId: string;
    teamMembershipId: string;
    dateEffectiveFrom: Date;
    number: number;
    position: string;
}

export default class CreateTeamMembershipHistoryCommandHandler implements IRequestHandler<CreateTeamMembershipHistoryCommand, CreateTeamMembershipHistoryCommandResult> {
    private readonly teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId> }) {
        this.teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: CreateTeamMembershipHistoryCommand): Promise<CreateTeamMembershipHistoryCommandResult> {
        // Team Exists
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;


        // Add history to membership
        const teamMembershipId = TeamMembershipId.executeCreate(command.teamMembershipId);
        const canAddTeamMembershipHistory = team.canAddHistoryToTeamMembership(teamMembershipId, { number: command.number, position: command.position, dateEffectiveFrom: command.dateEffectiveFrom });
        if (canAddTeamMembershipHistory.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddTeamMembershipHistory.error,
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                    path: [],
                }),
            );
        }

        team.executeAddHistoryToTeamMembership(teamMembershipId, {
            id: TeamMembershipHistoryId.executeCreate(command.id),
            number: command.number,
            position: command.position,
            dateEffectiveFrom: command.dateEffectiveFrom,
        });

        // Update team aggregate
        await this.teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

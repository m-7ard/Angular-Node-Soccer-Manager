import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import { err, ok } from "neverthrow";
import TeamMembership from "domain/entities/TeamMembership";
import ITeamValidator from "application/interfaces/ITeamValidator";
import { ITeamMembershipExistsValidatorFactory } from "application/interfaces/ITeamMembershipExistsValidator";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamId from "domain/valueObjects/Team/TeamId";
import IApplicationError from "application/errors/IApplicationError";

export type ReadTeamMembershipQueryResult = IQueryResult<{ team: Team; teamMembership: TeamMembership }, IApplicationError[]>;

export class ReadTeamMembershipQuery implements IQuery<ReadTeamMembershipQueryResult> {
    __returnType: ReadTeamMembershipQueryResult = null!;

    constructor({ teamId, teamMembershipId }: { teamId: string; teamMembershipId: string }) {
        this.teamId = teamId;
        this.teamMembershipId = teamMembershipId;
    }

    public teamId: string;
    public teamMembershipId: string;
}

export default class ReadTeamMembershipQueryHandler implements IRequestHandler<ReadTeamMembershipQuery, ReadTeamMembershipQueryResult> {
    private readonly teamExistsValidator: ITeamValidator<TeamId>;
    private readonly teamMembershipValidatorFactory: ITeamMembershipExistsValidatorFactory<TeamMembershipId>;
    
    constructor(props: { teamExistsValidator: ITeamValidator<TeamId>; teamMembershipValidatorFactory: ITeamMembershipExistsValidatorFactory<TeamMembershipId> }) {
        this.teamExistsValidator = props.teamExistsValidator;
        this.teamMembershipValidatorFactory = props.teamMembershipValidatorFactory;
    }

    async handle(command: ReadTeamMembershipQuery): Promise<ReadTeamMembershipQueryResult> {
        // Team Exists
        const teamId = TeamId.executeCreate(command.teamId);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        // Team Membership Exists
        const teamMembershipId = TeamMembershipId.executeCreate(command.teamMembershipId);
        const isTeamMemberValidator = this.teamMembershipValidatorFactory.create(team);
        const isTeamMemberResult = isTeamMemberValidator.validate(teamMembershipId);
        if (isTeamMemberResult.isErr()) {
            return err(isTeamMemberResult.error);
        }
        
        const teamMembership = isTeamMemberResult.value

        return ok({
            team: team,
            teamMembership: teamMembership,
        });
    }
}

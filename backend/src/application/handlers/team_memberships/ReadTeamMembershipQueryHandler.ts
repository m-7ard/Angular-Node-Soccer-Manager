import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import { err, ok } from "neverthrow";
import TeamMembership from "domain/entities/TeamMembership";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import IsTeamMemberValidator from "application/validators/_____IsTeamMemberValidator";

export type ReadTeamMembershipQueryResult = IQueryResult<{ team: Team; teamMembership: TeamMembership }, IApplicationError[]>;

export class ReadTeamMembershipQuery implements IQuery<ReadTeamMembershipQueryResult> {
    __returnType: ReadTeamMembershipQueryResult = null!;

    constructor({ teamId, playerId }: { teamId: string; playerId: string }) {
        this.teamId = teamId;
        this.playerId = playerId;
    }

    public teamId: string;
    public playerId: string;
}

export default class ReadTeamMembershipQueryHandler implements IRequestHandler<ReadTeamMembershipQuery, ReadTeamMembershipQueryResult> {
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { teamExistsValidator: TeamExistsValidator }) {
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: ReadTeamMembershipQuery): Promise<ReadTeamMembershipQueryResult> {
        const teamExistsResult = await this.teamExistsValidator.validate({ id: command.teamId });
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        const isTeamMemberValidator = new IsTeamMemberValidator();
        const isTeamMemberResult = isTeamMemberValidator.validate({ team: team, playerId: command.playerId });
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

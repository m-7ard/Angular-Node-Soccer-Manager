import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import { err, ok } from "neverthrow";
import TeamId from "domain/valueObjects/Team/TeamId";
import ITeamValidator from "application/interfaces/ITeamValidator";
import IApplicationError from "application/errors/IApplicationError";

export type ReadTeamQueryResult = IQueryResult<Team, IApplicationError[]>;

export class ReadTeamQuery implements IQuery<ReadTeamQueryResult> {
    __returnType: ReadTeamQueryResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadTeamQueryHandler implements IRequestHandler<ReadTeamQuery, ReadTeamQueryResult> {
    private readonly teamExistsValidator: ITeamValidator<TeamId>;
    
    constructor(props: {
        teamExistsValidator: ITeamValidator<TeamId>;
    }) {
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: ReadTeamQuery): Promise<ReadTeamQueryResult> {
        const teamId = TeamId.executeCreate(command.id);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        return ok(team);
    }
}

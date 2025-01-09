import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import { err, ok } from "neverthrow";
import TeamExistsValidator from "application/validators/TeamExistsValidator";

export type ReadTeamQueryResult = IQueryResult<Team, IApplicationError[]>;

export class ReadTeamQuery implements IQuery<ReadTeamQueryResult> {
    __returnType: ReadTeamQueryResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadTeamQueryHandler implements IRequestHandler<ReadTeamQuery, ReadTeamQueryResult> {
    private readonly teamExistsValidator: TeamExistsValidator;
    
    constructor(props: {
        teamExistsValidator: TeamExistsValidator;
    }) {
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: ReadTeamQuery): Promise<ReadTeamQueryResult> {
        const teamExistsResult = await this.teamExistsValidator.validate({ id: command.id });
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        return ok(team);
    }
}

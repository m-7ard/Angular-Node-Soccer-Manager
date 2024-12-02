import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import ITeamRepository from "../../interfaces/ITeamRepository";
import { err, ok } from "neverthrow";
import validationErrorCodes from "application/errors/validationErrorCodes";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";

export type ReadTeamQueryResult = IQueryResult<Team, IApplicationError[]>;

export class ReadTeamQuery implements IQuery<ReadTeamQueryResult> {
    __returnType: ReadTeamQueryResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadTeamQueryHandler implements IRequestHandler<ReadTeamQuery, ReadTeamQueryResult> {
    private readonly _teamRepository: ITeamRepository;
    
    constructor(props: {
        teamRepository: ITeamRepository;
    }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(command: ReadTeamQuery): Promise<ReadTeamQueryResult> {
        const team = await this._teamRepository.getByIdAsync(command.id);
        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: validationErrorCodes.ModelDoesNotExist,
                    path: ["_"],
                    message: `Team of id ${command.id} does not exist.`,
                }),
            );
        }

        return ok(team);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import ITeamRepository from "../../interfaces/ITeamRepository";
import { err, ok } from "neverthrow";
import validationErrorCodes from "application/errors/validationErrorCodes";

export type ReadTeamQueryResult = IQueryResult<Team, IApplicationError[]>;

export class ReadTeamQuery implements IQuery<ReadTeamQueryResult> {
    __returnType: ReadTeamQueryResult = null!;
    
    constructor({
        id
    }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadTeamQueryHandler implements IRequestHandler<ReadTeamQuery, ReadTeamQueryResult> {
    constructor(private readonly _teamRepository: ITeamRepository) {}
    
    async handle(command: ReadTeamQuery): Promise<ReadTeamQueryResult> {
        const team = await this._teamRepository.getByIdAsync(command.id);
        if (team == null) {
            const errors: IApplicationError[] = [
                {
                    code: validationErrorCodes.ModelDoesNotExist,
                    path: ["_"],
                    message: `Team of id ${command.id} does not exist.`
                }   
            ];

            return err(errors);
        }
        
        return ok(team);
    }
}
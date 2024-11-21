import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import ITeamRepository from "../../interfaces/ITeamRepository";
import { err, ok } from "neverthrow";

export type ListTeamsQueryResult = IQueryResult<Team[], IApplicationError[]>;

export class ListTeamsQuery implements IQuery<ListTeamsQueryResult> {
    __returnType: ListTeamsQueryResult = null!;

    constructor({}: {}) {}
}

export default class ListTeamsQueryHandler implements IRequestHandler<ListTeamsQuery, ListTeamsQueryResult> {
    private readonly _teamRepository: ITeamRepository;
    
    constructor(props: {
        teamRepository: ITeamRepository;
    }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(query: ListTeamsQuery): Promise<ListTeamsQueryResult> {
        const teams = await this._teamRepository.findAllAsync();
        return ok(teams);
    }
}

import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import ITeamRepository from "../../interfaces/ITeamRepository";
import { err, ok } from "neverthrow";
import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import IApplicationError from "application/errors/IApplicationError";

export type ListTeamsQueryResult = IQueryResult<Team[], IApplicationError[]>;

export class ListTeamsQuery implements IQuery<ListTeamsQueryResult> {
    __returnType: ListTeamsQueryResult = null!;

    constructor(props: {
        name: string | null;
        teamMembershipPlayerId: string | null;
        limitBy: number | null;
    }) {
        this.name = props.name;
        this.teamMembershipPlayerId = props.teamMembershipPlayerId;
        this.limitBy = props.limitBy;
    }

    public name: string | null;
    public teamMembershipPlayerId: string | null;
    public limitBy: number | null;
}

export default class ListTeamsQueryHandler implements IRequestHandler<ListTeamsQuery, ListTeamsQueryResult> {
    private readonly _teamRepository: ITeamRepository;
    
    constructor(props: {
        teamRepository: ITeamRepository;
    }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(query: ListTeamsQuery): Promise<ListTeamsQueryResult> {
        if (query.limitBy != null && ![5, 24].includes(query.limitBy)) {
            query.limitBy = 24;
        }

        if (query.teamMembershipPlayerId != null && !PlayerId.canCreate(query.teamMembershipPlayerId)) {
            query.teamMembershipPlayerId = null;
        }

        const criteria = new FilterAllTeamsCriteria({
            name: query.name,
            teamMembershipPlayerId: query.teamMembershipPlayerId == null ? null : PlayerId.executeCreate(query.teamMembershipPlayerId),
            limitBy: query.limitBy
        })
        
        const teams = await this._teamRepository.filterAllAsync(criteria);
        return ok(teams);
    }
}

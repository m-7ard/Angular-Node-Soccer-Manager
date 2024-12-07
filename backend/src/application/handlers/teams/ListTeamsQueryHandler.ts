import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import ITeamRepository from "../../interfaces/ITeamRepository";
import { err, ok } from "neverthrow";
import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";
import TeamMembership from "domain/entities/TeamMembership";

export type ListTeamsQueryResult = IQueryResult<Team[], IApplicationError[]>;

export class ListTeamsQuery implements IQuery<ListTeamsQueryResult> {
    __returnType: ListTeamsQueryResult = null!;

    constructor(props: {
        name: string | null;
        teamMembershipPlayerId: TeamMembership["playerId"] | null;
    }) {
        this.name = props.name;
        this.teamMembershipPlayerId = props.teamMembershipPlayerId;
    }

    public name: string | null;
    public teamMembershipPlayerId: TeamMembership["playerId"] | null;
}

export default class ListTeamsQueryHandler implements IRequestHandler<ListTeamsQuery, ListTeamsQueryResult> {
    private readonly _teamRepository: ITeamRepository;
    
    constructor(props: {
        teamRepository: ITeamRepository;
    }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(query: ListTeamsQuery): Promise<ListTeamsQueryResult> {
        const criteria = new FilterAllTeamsCriteria({
            name: null,
            teamMembershipPlayerId: null
        })
        const teams = await this._teamRepository.filterAllAsync(criteria);
        return ok(teams);
    }
}

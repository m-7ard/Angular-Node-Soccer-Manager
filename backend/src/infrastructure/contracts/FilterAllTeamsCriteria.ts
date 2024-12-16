import TeamMembership from "domain/entities/TeamMembership";

export default class FilterAllTeamsCriteria {
    constructor(props: { name: string | null; teamMembershipPlayerId: TeamMembership["playerId"] | null; limitBy: number | null }) {
        this.name = props.name;
        this.teamMembershipPlayerId = props.teamMembershipPlayerId;
        this.limitBy = props.limitBy;
    }

    public name: string | null;
    public teamMembershipPlayerId: TeamMembership["playerId"] | null;
    public limitBy: number | null;
}

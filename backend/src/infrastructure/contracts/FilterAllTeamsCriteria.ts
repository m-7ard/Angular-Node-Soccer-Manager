import TeamMembership from "domain/entities/TeamMembership";

export default class FilterAllTeamsCriteria {
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
class TeamMembershipHistory {
    constructor({
        id,
        teamMembershipId,
        dateEffectiveFrom,
        number,
        position,
    }: {
        id: string;
        teamMembershipId: string;
        dateEffectiveFrom: string;
        number: number;
        position: string;
    }) {
        this.id = id;
        this.teamMembershipId = teamMembershipId;
        this.dateEffectiveFrom = dateEffectiveFrom;
        this.number = number;
        this.position = position;
    }

    id: string;
    teamMembershipId: string;
    dateEffectiveFrom: string;
    number: number;
    position: string;
}

export default TeamMembershipHistory;

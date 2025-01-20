import PlayerPosition from "../values/PlayerPosition";

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
        position: PlayerPosition;
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
    position: PlayerPosition;
}

export default TeamMembershipHistory;

import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";

class TeamMembership {
    private readonly __type: "TEAM_MEMBERSHIP_DOMAIN" = null!;

    constructor({ id, teamId, playerId, number, teamMembershipDates }: { id: string; teamId: string; playerId: string; number: number; teamMembershipDates: TeamMembershipDates }) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.number = number;
        this.teamMembershipDates = teamMembershipDates;
    }

    public isActive() {
        return this.teamMembershipDates.activeTo == null;
    }

    public id: string;
    public teamId: string;
    public playerId: string;
    public teamMembershipDates: TeamMembershipDates;
    public number: number;
}

export default TeamMembership;

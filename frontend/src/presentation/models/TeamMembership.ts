import TeamMembershipHistory from "./TeamMembershipHistory";

class TeamMembership {
    constructor({ id, teamId, playerId, activeFrom, activeTo, effectiveHistory }: { id: string; teamId: string; playerId: string; activeFrom: Date; activeTo: Date | null; effectiveHistory: TeamMembershipHistory | null; }) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
        this.effectiveHistory = effectiveHistory;
    }

    public id: string;
    public teamId: string;
    public playerId: string;
    public activeFrom: Date;
    public activeTo: Date | null;
    public effectiveHistory: TeamMembershipHistory | null


    isActive() {
        return this.activeTo == null;
    }
}

export default TeamMembership;

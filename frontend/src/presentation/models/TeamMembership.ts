class TeamMembership {
    constructor({ id, teamId, playerId, activeFrom, activeTo }: { id: string; teamId: string; playerId: string; activeFrom: Date; activeTo: Date | null; }) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
    }

    public id: string;
    public teamId: string;
    public playerId: string;
    public activeFrom: Date;
    public activeTo: Date | null;

    isActive() {
        return this.activeTo == null;
    }
}

export default TeamMembership;

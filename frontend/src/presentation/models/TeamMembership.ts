class TeamMembership {
    constructor({ id, teamId, playerId, activeFrom, activeTo, number: number }: { id: string; teamId: string; playerId: string; activeFrom: Date; activeTo: Date | null; number: number }) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
        this.number = number;
    }

    public id: string;
    public teamId: string;
    public playerId: string;
    public activeFrom: Date;
    public activeTo: Date | null;
    public number: number;

    isActive() {
        return this.activeTo == null;
    }
}

export default TeamMembership;

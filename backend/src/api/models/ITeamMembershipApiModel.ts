interface ITeamMembershipApiModel {
    id: string;
    teamId: string;
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
    number: number;
}

export default ITeamMembershipApiModel;
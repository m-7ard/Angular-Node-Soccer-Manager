interface ITeamMembershipApiModel {
    id: string;
    teamId: string;
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
}

export default ITeamMembershipApiModel;
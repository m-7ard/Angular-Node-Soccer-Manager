interface ITeamMembershipApiModel {
    id: string;
    teamId: string;
    playerId: string;
    activeFrom: string;
    activeTo: string | null;
    number: number;
}

export default ITeamMembershipApiModel;
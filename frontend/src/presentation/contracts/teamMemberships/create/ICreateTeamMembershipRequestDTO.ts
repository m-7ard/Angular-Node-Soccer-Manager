interface ICreateTeamMembershipRequestDTO {
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
}

export default ICreateTeamMembershipRequestDTO;

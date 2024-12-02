interface ICreateTeamMembershipRequestDTO {
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
    number: number;
}

export default ICreateTeamMembershipRequestDTO;

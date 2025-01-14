interface ICreateTeamMembershipRequestDTO {
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
    number: number;
    position: string;
}

export default ICreateTeamMembershipRequestDTO;

interface IUpdateTeamMembershipRequestDTO {
    activeFrom: Date;
    activeTo: Date | null;
    number: number;
}

export default IUpdateTeamMembershipRequestDTO;

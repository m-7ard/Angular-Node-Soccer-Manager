interface ICreateTeamMembershipRequestDTO {
    playerId: string;
    activeFrom: Date;
    activeTo: Date | null;
    number: number;
    position: string;
    dateEffectiveFrom: Date;
}

export default ICreateTeamMembershipRequestDTO;

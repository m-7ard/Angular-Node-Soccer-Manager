interface IListMatchesRequestDTO {
    scheduledDate: Date | null;
    limitBy: number | null;
    status: string | null;
    teamId: string | null;
}

export default IListMatchesRequestDTO;
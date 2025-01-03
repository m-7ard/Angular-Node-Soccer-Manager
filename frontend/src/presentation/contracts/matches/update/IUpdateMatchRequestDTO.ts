interface IUpdateMatchRequestDTO {
    venue: string;
    scheduledDate: Date;
    startDate: Date;
    endDate: Date | null;
    status: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
}

export default IUpdateMatchRequestDTO;

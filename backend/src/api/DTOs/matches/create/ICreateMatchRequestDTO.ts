interface ICreateMatchRequestDTO {
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startDate: Date;
    endDate: Date | null;
    status: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
}

export default ICreateMatchRequestDTO;

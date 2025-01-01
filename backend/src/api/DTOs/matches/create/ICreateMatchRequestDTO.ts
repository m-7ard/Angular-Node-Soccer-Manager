interface ICreateMatchRequestDTO {
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    score: {
        homeTeamScore: number;
        awayTeamScore: number;
    } | null;
}

export default ICreateMatchRequestDTO;

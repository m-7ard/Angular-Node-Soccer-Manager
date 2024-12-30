interface ICreateMatchRequestDTO {
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startTime: Date;
    endTime: Date | null;
    status: string;
    homeTeamScore: number | null;
    awayTeamScore: number | null;
}

export default ICreateMatchRequestDTO;

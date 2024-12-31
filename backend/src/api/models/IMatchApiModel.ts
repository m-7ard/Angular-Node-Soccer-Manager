export default interface IMatchApiModel {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: string;
    startTime: string;
    endTime: string | null;
    status: string;
    score: {
        homeTeamScore: number,
        awayTeamScore: number
    } | null;
}

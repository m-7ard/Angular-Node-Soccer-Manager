import ITeamApiModel from "./ITeamApiModel";

export default interface IMatchApiModel {
    id: string;
    homeTeam: ITeamApiModel;
    awayTeam: ITeamApiModel;
    venue: string;
    scheduledDate: string;
    startDate: string | null;
    endDate: string | null;
    status: string;
    score: {
        homeTeamScore: number,
        awayTeamScore: number
    } | null;
}

import IUidRecord from "api/interfaces/IUidRecord";

interface ICreateMatchRequestDTO {
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    goals: IUidRecord<{ dateOccured: Date; teamId: string; playerId: string; }> | null;
}

export default ICreateMatchRequestDTO;

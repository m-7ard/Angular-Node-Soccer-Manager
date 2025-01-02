interface IScheduleMatchRequestDTO {
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
}

export default IScheduleMatchRequestDTO;

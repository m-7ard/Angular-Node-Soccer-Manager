import ITeamSchema from "./ITeamSchema";

export default interface IMatchSchema {
    id: string;
    home_team_id: ITeamSchema["id"];
    away_team_id: ITeamSchema["id"];
    venue: string;
    scheduled_date: Date;
    start_date: Date;
    end_date: Date | null;
    status: string;
    home_team_score: number | null;
    away_team_score: number | null;
    created_at: Date;
    updated_at: Date;
}

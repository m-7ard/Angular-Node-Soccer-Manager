import IMatchSchema from "./IMatchSchema";
import IPlayerSchema from "./IPlayerSchema";
import ITeamSchema from "./ITeamSchema";

export default interface IMatchEventSchema {
    id: string;
    match_id: IMatchSchema["id"];
    player_id: IPlayerSchema["id"];
    team_id: ITeamSchema["id"];
    type: string;
    date_occured: Date;
    secondary_player_id: IPlayerSchema["id"] | null;
    description: string;
    created_at: Date;
    updated_at: Date;
}


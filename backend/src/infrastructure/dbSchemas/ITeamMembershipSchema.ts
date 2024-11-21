import IPlayerSchema from "./IPlayerSchema";
import ITeamSchema from "./ITeamSchema";

export default interface ITeamMembershipSchema {
    id: string;
    team_id: string;
    player_id: string;
    active_from: Date;
    active_to: Date | null;
}

export interface ITeamMembershipRelations {
    team: ITeamSchema | null;
    player: IPlayerSchema | null;
}
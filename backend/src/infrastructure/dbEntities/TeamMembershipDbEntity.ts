import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import TeamDbEntity from "./TeamDbEntity";
import PlayerDbEntity from "./PlayerDbEntity";

class TeamMembershipDbEntity implements ITeamMembershipSchema {
    constructor(props: { id: string; team_id: string; player_id: string; active_from: Date; active_to: Date | null; number: number }) {
        this.id = props.id;
        this.team_id = props.team_id;
        this.player_id = props.player_id;
        this.active_from = props.active_from;
        this.active_to = props.active_to;
        this.number = props.number;
    }

    public id: string;
    public team_id: string;
    public player_id: string;
    public active_from: Date;
    public active_to: Date | null;
    public number: number;
    
    public team: TeamDbEntity | null = null;
    public player: PlayerDbEntity | null = null;
}

export default TeamMembershipDbEntity;

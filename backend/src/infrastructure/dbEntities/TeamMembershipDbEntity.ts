import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import ITeamMembershipSchema, { ITeamMembershipRelations } from "infrastructure/dbSchemas/ITeamMembershipSchema";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";

class TeamMembershipDbEntity implements ITeamMembershipSchema, ITeamMembershipRelations {
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
    public team: ITeamSchema | null = null;
    public player: IPlayerSchema | null = null;
    public number: number;
}

export default TeamMembershipDbEntity;

import IPlayerSchema, { IPlayerRelations } from "infrastructure/dbSchemas/IPlayerSchema";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";

class PlayerDbEntity implements IPlayerSchema, IPlayerRelations {
    constructor(props: { id: string; name: string; active_since: Date; }) {
        this.id = props.id;
        this.name = props.name;
        this.active_since = props.active_since;
    }

    public id: string;
    public name: string;
    public active_since: Date;
    public team_memberships: ITeamMembershipSchema[] = [];
}

export default PlayerDbEntity;

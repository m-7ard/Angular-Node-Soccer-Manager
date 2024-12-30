import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import TeamMembershipDbEntity from "./TeamMembershipDbEntity";

class PlayerDbEntity implements IPlayerSchema {
    constructor(props: { id: string; name: string; active_since: Date; }) {
        this.id = props.id;
        this.name = props.name;
        this.active_since = props.active_since;
    }

    public id: string;
    public name: string;
    public active_since: Date;

    public team_memberships: TeamMembershipDbEntity[] = [];
}

export default PlayerDbEntity;

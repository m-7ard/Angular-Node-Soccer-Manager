import IPlayerSchema, { IPlayerRelations } from "infrastructure/dbSchemas/IPlayerSchema";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";

class PlayerDbEntity implements IPlayerSchema, IPlayerRelations {
    constructor(props: { id: string; name: string; activeSince: Date; }) {
        this.id = props.id;
        this.name = props.name;
        this.activeSince = props.activeSince;
    }

    public id: string;
    public name: string;
    public activeSince: Date;
    public team_memberships: ITeamMembershipSchema[] = [];
}

export default PlayerDbEntity;

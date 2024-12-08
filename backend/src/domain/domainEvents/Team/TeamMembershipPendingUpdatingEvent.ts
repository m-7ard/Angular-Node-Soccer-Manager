import TeamMembership from "domain/entities/TeamMembership";
import DomainEvent from "../DomainEvent";

class TeamMembershipPendingUpdatingEvent extends DomainEvent {
    payload: TeamMembership;

    constructor(teamMembership: TeamMembership) {
        super();
        this.payload = teamMembership;
    }


    readonly EVENT_TYPE = "TEAM_MEMBERSHIP_PENDING_UPDATING";
}

export default TeamMembershipPendingUpdatingEvent;

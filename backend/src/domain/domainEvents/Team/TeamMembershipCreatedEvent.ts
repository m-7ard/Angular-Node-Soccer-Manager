import TeamMembership from "domain/entities/TeamMembership";
import DomainEvent from "../DomainEvent";

class TeamMembershipCreatedEvent extends DomainEvent {
    payload: TeamMembership;

    constructor(teamMembership: TeamMembership) {
        super();
        this.payload = teamMembership;
    }


    readonly EVENT_TYPE = "TEAM_MEMBERSHIP_CREATED";
}

export default TeamMembershipCreatedEvent;

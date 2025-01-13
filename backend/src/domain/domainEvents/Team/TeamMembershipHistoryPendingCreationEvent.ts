import DomainEvent from "../DomainEvent";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";

class TeamMembershipHistoryPendingCreationEvent extends DomainEvent {
    payload: TeamMembershipHistory;

    constructor(teamMembership: TeamMembershipHistory) {
        super();
        this.payload = teamMembership;
    }

    readonly EVENT_TYPE = "TEAM_MEMBERSHIP_HISTORY_PENDING_CREATION";
}

export default TeamMembershipHistoryPendingCreationEvent;

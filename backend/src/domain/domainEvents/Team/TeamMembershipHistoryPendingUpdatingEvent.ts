import DomainEvent from "../DomainEvent";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";

class TeamMembershipHistoryPendingUpdatingEvent extends DomainEvent {
    payload: TeamMembershipHistory;

    constructor(teamMembership: TeamMembershipHistory) {
        super();
        this.payload = teamMembership;
    }

    readonly EVENT_TYPE = "TEAM_MEMBERSHIP_HISTORY_PENDING_UPDATING";
}

export default TeamMembershipHistoryPendingUpdatingEvent;

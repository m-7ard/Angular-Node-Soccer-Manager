import DomainEvent from "../DomainEvent";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";

class TeamMembershipHistoryPendingDeletionEvent extends DomainEvent {
    payload: TeamMembershipHistory;

    constructor(teamMembership: TeamMembershipHistory) {
        super();
        this.payload = teamMembership;
    }

    readonly EVENT_TYPE = "TEAM_MEMBERSHIP_HISTORY_PENDING_DELETION";
}

export default TeamMembershipHistoryPendingDeletionEvent;

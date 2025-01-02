import DomainEvent from "../DomainEvent";
import MatchEvent from "domain/entities/MatchEvent";

class MatchEventPendingCreationEvent extends DomainEvent {
    payload: MatchEvent;

    constructor(matchEvent: MatchEvent) {
        super();
        this.payload = matchEvent;
    }


    readonly EVENT_TYPE = "MATCH_PENDING_CREATION";
}

export default MatchEventPendingCreationEvent;

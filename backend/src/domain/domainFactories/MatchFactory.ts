import Match from "domain/entities/Match";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";

class MatchFactory {
    static CreateNew(props: {
        id: Match["id"];
        homeTeamId: Match["homeTeamId"];
        awayTeamId: Match["awayTeamId"];
        venue: Match["venue"];
        scheduledDate: Match["scheduledDate"];
        startTime: Match["startTime"];
    }) {
        return new Match({
            id: props.id,
            homeTeamId: props.homeTeamId,
            awayTeamId: props.awayTeamId,
            venue: props.venue,
            scheduledDate: props.scheduledDate,
            startTime: props.startTime,
            endTime: null,
            status: MatchStatus.SCHEDULED,
            score: null,
            events: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static CreateExisting(props: {
        id: Match["id"];
        homeTeamId: Match["homeTeamId"];
        awayTeamId: Match["awayTeamId"];
        venue: Match["venue"];
        scheduledDate: Match["scheduledDate"];
        startTime: Match["startTime"];
        endTime: Match["endTime"];
        status: Match["status"];
        score: Match["score"];
        events: Match["events"];
        createdAt: Match["createdAt"];
        updatedAt: Match["updatedAt"];
    }) {
        return new Match({
            id: props.id,
            homeTeamId: props.homeTeamId,
            awayTeamId: props.awayTeamId,
            venue: props.venue,
            scheduledDate: props.scheduledDate,
            startTime: props.startTime,
            endTime: props.endTime,
            status: props.status,
            score: props.score,
            events: props.events,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }
}

export default MatchFactory;

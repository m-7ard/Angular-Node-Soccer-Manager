import Match from "domain/entities/Match";

class MatchFactory {
    static CreateNew(props: {
        id: Match["id"];
        homeTeamId: Match["homeTeamId"];
        awayTeamId: Match["awayTeamId"];
        venue: Match["venue"];
        matchDates: Match["matchDates"]
        status: Match["status"];
    }) {
        return new Match({
            id: props.id,
            homeTeamId: props.homeTeamId,
            awayTeamId: props.awayTeamId,
            venue: props.venue,
            matchDates: props.matchDates,
            status: props.status,
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
        matchDates: Match["matchDates"];
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
            matchDates: props.matchDates,
            status: props.status,
            score: props.score,
            events: props.events,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }
}

export default MatchFactory;

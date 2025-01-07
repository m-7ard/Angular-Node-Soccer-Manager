import Match from "domain/entities/Match";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import { err, ok, Result } from "neverthrow";

class MatchDomainService {
    private static validateScheduledMatch(match: Match): void {
        if (match.matchDates.startDate != null) {
            throw new Error("A scheduled match cannot have a startDate");
        }

        if (match.matchDates.endDate != null) {
            throw new Error("A scheduled match cannot have an endDate");
        }

        if (match.score != null) {
            throw new Error("A scheduled match cannot have a score");
        }
    }

    private static validateInProgressMatch(match: Match): void {
        if (match.matchDates.startDate == null) {
            throw new Error("An in-progress match cannot have a null startDate");
        }

        if (match.matchDates.endDate != null) {
            throw new Error("An in-progress match cannot have an endDate");
        }
    }

    private static validateCompletedMatch(match: Match): void {
        if (match.matchDates.startDate == null) {
            throw new Error("A completed match cannot have a null startDate");
        }

        if (match.matchDates.endDate == null) {
            throw new Error("A completed match cannot have a null endDate");
        }

        if (match.score == null) {
            throw new Error("A completed match cannot have a null score");
        }
    }

    private static validateTeams(match: Match): void {
        if (match.homeTeamId === match.awayTeamId) {
            throw new Error("Home team cannot be the same as the away team");
        }
    }

    private static validateScoreConsistency(match: Match): void {
        if (match.matchDates.startDate != null && match.score == null) {
            throw new Error("A match with a startDate must also have a score");
        }

        if (match.score != null && match.matchDates.startDate == null) {
            throw new Error("A match with a score must also have a startDate");
        }
    }

    private static validateDates(match: Match): void {
        if (match.matchDates.endDate != null && match.matchDates.startDate == null) {
            throw new Error("startDate cannot be null when endDate is set");
        }
    }

    private static validateGoalsConsistency(match: Match): void {
        const goals = match.getGoals();

        if (match.score == null && goals.length > 0) {
            throw new Error("Score cannot be null when goal events exist");
        }

        if (match.score != null) {
            const homeTeamGoals = goals.filter((goal) => goal.teamId === match.homeTeamId);
            if (homeTeamGoals.length !== match.score.homeTeamScore) {
                throw new Error(`Home team score does not match goals. Score: ${match.score.homeTeamScore}; Goals: ${homeTeamGoals.length}`);
            }

            const awayTeamGoals = goals.filter((goal) => goal.teamId === match.awayTeamId);
            if (awayTeamGoals.length !== match.score.awayTeamScore) {
                throw new Error(`Away team score does not match goals. Score: ${match.score.awayTeamScore}; Goals: ${awayTeamGoals.length}`);
            }
        }
    }

    public static verifyIntegrity(match: Match): void {
        /*
            RULES: 
                - Scheduled Match:
                    * [matchDates.startDate] must be null
                    * [matchDates.endDate] must be null
                    * [score] must be null
                
                - In Progress Match: 
                    * [matchDates.startDate] cannot be null
                    * [matchDates.endDate] must be null
                    * [score] cannot be null
                
                - Completed Match:
                    * [matchDates.startDate] cannot be null
                    * [matchDates.endDate] cannot be null
                    * [score] cannot be null
                
                - Cancelled Match:
                    * must obey match wide rules
                
                - Match Wide Rules:
                    * Home team cannot be the same as away team
                    * If [matchDates.startDate] exists, [score] must also exist
                    * If [score] exists, [startDate] must also exist
                    * If [matchDates.endDate] exists, [matchDates.startDate] must also exist
                    * If both [startDate] and [endDate] exist, duration must be at least 90 minutes
                    * If [score] is null, there cannot be any goal events
                    * If [score] exists, the number of home team goals must match homeTeamScore
                    * If [score] exists, the number of away team goals must match awayTeamScore
        */

        this.validateTeams(match);
        this.validateScoreConsistency(match);
        this.validateDates(match);
        this.validateGoalsConsistency(match);

        if (match.status === MatchStatus.SCHEDULED) {
            this.validateScheduledMatch(match);
        } else if (match.status === MatchStatus.IN_PROGRESS) {
            this.validateInProgressMatch(match);
        } else if (match.status === MatchStatus.IN_PROGRESS) {
            this.validateCompletedMatch(match);
        }
    }

    public static canMarkInProgress(match: Match, props: { startDate: Date }): Result<true, string> {
        const statusResult = match.canTransitionStatus(MatchStatus.IN_PROGRESS.value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        const canCreateMatchDatesResult = MatchDates.canCreate({
            scheduledDate: match.matchDates.scheduledDate,
            startDate: props.startDate,
            endDate: match.matchDates.endDate,
        });
        if (canCreateMatchDatesResult.isErr()) {
            return err(canCreateMatchDatesResult.error);
        }

        return ok(true);
    }

    public static executeMarkInProgress(match: Match, props: { startDate: Date }): void {
        const canMarkInProgressResult = this.canMarkInProgress(match, props);
        if (canMarkInProgressResult.isErr()) {
            throw new Error(canMarkInProgressResult.error);
        }

        match.executeTransitionStatus(MatchStatus.IN_PROGRESS.value);
        match.score = MatchScore.ZeroScore;
        match.matchDates = MatchDates.executeCreate({
            scheduledDate: match.matchDates.scheduledDate,
            startDate: props.startDate,
            endDate: match.matchDates.endDate,
        });
        MatchDomainService.verifyIntegrity(match);
    }

    public static canMarkCompleted(match: Match, props: { endDate: Date }): Result<true, string> {
        const statusResult = match.canTransitionStatus(MatchStatus.COMPLETED.value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        const canCreateMatchDatesResult = MatchDates.canCreate({
            scheduledDate: match.matchDates.scheduledDate,
            startDate: match.matchDates.startDate,
            endDate: props.endDate,
        });
        if (canCreateMatchDatesResult.isErr()) {
            return err(canCreateMatchDatesResult.error);
        }

        return ok(true);
    }

    public static executeMarkCompleted(match: Match, props: { endDate: Date }): Result<true, string> {
        match.executeTransitionStatus(MatchStatus.COMPLETED.value);
        match.matchDates = MatchDates.executeCreate({
            scheduledDate: match.matchDates.scheduledDate,
            startDate: match.matchDates.startDate,
            endDate: props.endDate,
        });

        MatchDomainService.verifyIntegrity(match);
        return ok(true);
    }

    public static canMarkCancelled(match: Match): Result<true, string> {
        const statusResult = match.canTransitionStatus(MatchStatus.CANCELLED.value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        MatchDomainService.verifyIntegrity(match);
        return ok(true);
    }

    public static executeMarkCancelled(match: Match): void {
        const markCancelledResult = this.canMarkCancelled(match);
        if (markCancelledResult.isErr()) {
            throw new Error(markCancelledResult.error);
        }

        match.executeTransitionStatus(MatchStatus.CANCELLED.value);
    }
}

export default MatchDomainService;

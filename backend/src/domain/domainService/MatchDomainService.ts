import IUidRecord from "api/interfaces/IUidRecord";
import MatchFactory from "domain/domainFactories/MatchFactory";
import Match from "domain/entities/Match";
import Team from "domain/entities/Team";
import DomainErrorFactory from "domain/errors/DomainErrorFactory";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import { err, ok, Result } from "neverthrow";
import dateDiff from "utils/dateDifference";

class MatchDomainService {
    private static validateScheduledMatch(match: Match): void {
        if (match.startDate != null) {
            throw new Error("A scheduled match cannot have a startDate");
        }

        if (match.endDate != null) {
            throw new Error("A scheduled match cannot have an endDate");
        }

        if (match.score != null) {
            throw new Error("A scheduled match cannot have a score");
        }
    }

    private static validateInProgressMatch(match: Match): void {
        if (match.startDate == null) {
            throw new Error("An in-progress match cannot have a null startDate");
        }

        if (match.endDate != null) {
            throw new Error("An in-progress match cannot have an endDate");
        }

        if (match.score == null) {
            throw new Error("An in-progress match cannot have a null score");
        }

        if (match.startDate < match.scheduledDate) {
            throw new Error("An in-progress match cannot start before its scheduledDate");
        }
    }

    private static validateCompletedMatch(match: Match): void {
        if (match.startDate == null) {
            throw new Error("A completed match cannot have a null startDate");
        }

        if (match.endDate == null) {
            throw new Error("A completed match cannot have a null endDate");
        }

        if (match.score == null) {
            throw new Error("A completed match cannot have a null score");
        }

        if (dateDiff(match.startDate, match.endDate, "minutes") < 90) {
            throw new Error("A completed match must have a duration of at least 90 minutes");
        }
    }

    private static validateTeams(match: Match): void {
        if (match.homeTeamId === match.awayTeamId) {
            throw new Error("Home team cannot be the same as the away team");
        }
    }

    private static validateScoreConsistency(match: Match): void {
        if (match.startDate != null && match.score == null) {
            throw new Error("A match with a startDate must also have a score");
        }

        if (match.score != null && match.startDate == null) {
            throw new Error("A match with a score must also have a startDate");
        }
    }

    private static validateDates(match: Match): void {
        if (match.endDate != null && match.startDate == null) {
            throw new Error("startDate cannot be null when endDate is set");
        }

        if (match.startDate != null && match.endDate != null) {
            const duration = dateDiff(match.startDate, match.endDate, "minutes");
            if (duration < 90) {
                throw new Error("A match with a startDate and endDate must have a duration of at least 90 minutes");
            }
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
                    * [startDate] must be null
                    * [endDate] must be null
                    * [score] must be null
                
                - In Progress Match: 
                    * [startDate] cannot be null
                    * [endDate] must be null
                    * [score] cannot be null
                    * [startDate] must be greater than or equal than [scheduledDate]
                
                - Completed Match:
                    * [startDate] cannot be null
                    * [endDate] cannot be null
                    * [score] cannot be null
                    * [endDate] must be 90 minutes greater than [startDate]
                
                - Cancelled Match:
                    * must obey match wide rules
                
                - Match Wide Rules:
                    * Home team cannot be the same as away team
                    * If [startDate] exists, [score] must also exist
                    * If [score] exists, [startDate] must also exist
                    * If [endDate] exists, [startDate] must also exist
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

    public static canCreateMatch(props: {
        id: string;
        homeTeam: Team;
        awayTeam: Team;
        venue: string;
        scheduledDate: Date;
        startDate: Date | null;
        endDate: Date | null;
        status: string;
        goals: Array<{ dateOccured: Date; teamId: string; playerId: string }> | null;
    }): Result<Match, IDomainError[]> {
        const statusResult = MatchStatus.tryCreate(props.status);
        if (statusResult.isErr()) {
            return err(
                DomainErrorFactory.createSingleListError({
                    message: statusResult.error,
                    path: ["status"],
                    code: "INVALID_STATUS",
                }),
            );
        }

        const match = MatchFactory.CreateNew({
            id: props.id,
            homeTeamId: props.homeTeam.id,
            awayTeamId: props.awayTeam.id,
            venue: props.venue,
            scheduledDate: props.scheduledDate,
            startDate: props.startDate,
            endDate: props.endDate,
            status: statusResult.value,
        });

        if (props.goals != null) {
            const addGoalErrors: IDomainError[] = [];
            match.score = MatchScore.ZeroScore;
            props.goals.map((goal) => {
                match.executeAddGoal(goal)
            });
            if (addGoalErrors.length) {
                return err(addGoalErrors);
            }
        }

        MatchDomainService.verifyIntegrity(match);
        return ok(match);
    }

    public static tryMarkInProgress(match: Match, props: { startDate: Date }): Result<true, IDomainError[]> {
        const statusResult = match.tryTransitionStatus(MatchStatus.IN_PROGRESS.value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        const startDateResult = match.trySetStartDate(props.startDate);
        if (startDateResult.isErr()) {
            return err(startDateResult.error);
        }

        match.score = MatchScore.ZeroScore;

        MatchDomainService.verifyIntegrity(match);
        return ok(true);
    }

    public static tryMarkCompleted(match: Match, props: { endDate: Date }): Result<true, IDomainError[]> {
        const statusResult = match.tryTransitionStatus(MatchStatus.COMPLETED.value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        const endDateResult = match.trySetEndDate(props.endDate);
        if (endDateResult.isErr()) {
            return err(endDateResult.error);
        }

        MatchDomainService.verifyIntegrity(match);
        return ok(true);
    }

    public static tryMarkCancelled(match: Match): Result<true, IDomainError[]> {
        const statusResult = match.tryTransitionStatus(MatchStatus.CANCELLED.value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        MatchDomainService.verifyIntegrity(match);
        return ok(true);
    }
}

export default MatchDomainService;

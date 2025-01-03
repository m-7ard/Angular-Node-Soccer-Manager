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
    private static createIntegrityError(message: string, path: string[]): IDomainError[] {
        return DomainErrorFactory.createSingleListError({
            message,
            code: "INTEGRITY_ERROR",
            path,
        });
    }

    private static validateScheduledMatch(match: Match): Result<true, IDomainError[]> {
        if (match.startDate != null) {
            return err(this.createIntegrityError("A scheduled match cannot have a startDate", ["startDate"]));
        }

        if (match.endDate != null) {
            return err(this.createIntegrityError("A scheduled match cannot have an endDate", ["endDate"]));
        }

        if (match.score != null) {
            return err(this.createIntegrityError("A scheduled match cannot have a score", ["score"]));
        }

        return ok(true);
    }

    private static validateInProgressMatch(match: Match): Result<true, IDomainError[]> {
        if (match.startDate == null) {
            return err(this.createIntegrityError("An in-progress match cannot have a null startDate", ["startDate"]));
        }

        if (match.endDate != null) {
            return err(this.createIntegrityError("An in-progress match cannot have an endDate", ["endDate"]));
        }

        if (match.score == null) {
            return err(this.createIntegrityError("An in-progress match cannot have a null score", ["score"]));
        }

        if (match.startDate < match.scheduledDate) {
            return err(this.createIntegrityError("An in-progress match cannot start before its scheduledDate", ["startDate"]));
        }

        return ok(true);
    }

    private static validateCompletedMatch(match: Match): Result<true, IDomainError[]> {
        if (match.startDate == null) {
            return err(this.createIntegrityError("A completed match cannot have a null startDate", ["startDate"]));
        }

        if (match.endDate == null) {
            return err(this.createIntegrityError("A completed match cannot have a null endDate", ["endDate"]));
        }

        if (match.score == null) {
            return err(this.createIntegrityError("A completed match cannot have a null score", ["score"]));
        }

        if (dateDiff(match.startDate, match.endDate, "minutes") < 90) {
            return err(this.createIntegrityError("A completed match must have a duration of at least 90 minutes", ["endDate"]));
        }

        return ok(true);
    }

    private static validateTeams(match: Match): Result<true, IDomainError[]> {
        if (match.homeTeamId === match.awayTeamId) {
            return err(this.createIntegrityError("Home team cannot be the same as the away team", ["_"]));
        }

        return ok(true);
    }

    private static validateScoreConsistency(match: Match): Result<true, IDomainError[]> {
        if (match.startDate != null && match.score == null) {
            return err(this.createIntegrityError("A match with a startDate must also have a score", ["score"]));
        }

        if (match.score != null && match.startDate == null) {
            return err(this.createIntegrityError("A match with a score must also have a startDate", ["startDate"]));
        }

        return ok(true);
    }

    private static validateDates(match: Match): Result<true, IDomainError[]> {
        if (match.endDate != null && match.startDate == null) {
            return err(this.createIntegrityError("startDate cannot be null when endDate is set", ["endDate"]));
        }

        if (match.startDate != null && match.endDate != null) {
            const duration = dateDiff(match.startDate, match.endDate, "minutes");
            if (duration < 90) {
                return err(this.createIntegrityError("A match with a startDate and endDate must have a duration of at least 90 minutes", ["endDate"]));
            }
        }

        return ok(true);
    }

    private static validateGoalsConsistency(match: Match): Result<true, IDomainError[]> {
        const goals = match.getGoals();

        if (match.score == null && goals.length > 0) {
            return err(this.createIntegrityError("Score cannot be null when goal events exist", ["score"]));
        }

        if (match.score != null) {
            const homeTeamGoals = goals.filter((goal) => goal.teamId === match.homeTeamId);
            if (homeTeamGoals.length !== match.score.homeTeamScore) {
                return err(this.createIntegrityError(`Home team score does not match goals. Score: ${match.score.homeTeamScore}; Goals: ${homeTeamGoals.length}`, ["score"]));
            }

            const awayTeamGoals = goals.filter((goal) => goal.teamId === match.awayTeamId);
            if (awayTeamGoals.length !== match.score.awayTeamScore) {
                return err(this.createIntegrityError(`Away team score does not match goals. Score: ${match.score.awayTeamScore}; Goals: ${awayTeamGoals.length}`, ["score"]));
            }
        }

        return ok(true);
    }

    public static tryVerifyIntegrity(match: Match): Result<true, IDomainError[]> {
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

        const teamValidation = this.validateTeams(match);
        if (teamValidation.isErr()) return teamValidation;

        const scoreValidation = this.validateScoreConsistency(match);
        if (scoreValidation.isErr()) return scoreValidation;

        const datesValidation = this.validateDates(match);
        if (datesValidation.isErr()) return datesValidation;

        const goalsValidation = this.validateGoalsConsistency(match);
        if (goalsValidation.isErr()) return goalsValidation;

        switch (match.status) {
            case MatchStatus.SCHEDULED:
                return this.validateScheduledMatch(match);
            case MatchStatus.IN_PROGRESS:
                return this.validateInProgressMatch(match);
            case MatchStatus.COMPLETED:
                return this.validateCompletedMatch(match);
            case MatchStatus.CANCELLED:
                return ok(true);
            default:
                return err(this.createIntegrityError(`Unhandled match status: ${match.status}`, ["status"]));
        }
    }

    public static tryCreateMatch(props: {
        id: string;
        homeTeam: Team;
        awayTeam: Team;
        venue: string;
        scheduledDate: Date;
        startDate: Date | null;
        endDate: Date | null;
        status: string;
        goals: IUidRecord<{ dateOccured: Date; teamId: string; playerId: string }> | null;
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
            // ignores goals if it can't have a score
            const addGoalErrors: IDomainError[] = [];
            if (match.canHaveScore()) {
                match.score = MatchScore.ZeroScore;
                Object.entries(props.goals).forEach(([UID, goal]) => {
                    const addGoalResult = match.tryAddGoal(goal);
                    if (addGoalResult.isErr()) {
                        addGoalErrors.push(...addGoalResult.error.map((error) => ({ ...error, path: [UID, ...error.path] })));
                    }
                });
            }

            if (addGoalErrors.length) {
                return err(addGoalErrors);
            }
        }

        const matchIntegrityResult = MatchDomainService.tryVerifyIntegrity(match);
        if (matchIntegrityResult.isErr()) {
            return err(matchIntegrityResult.error);
        }

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

        const matchIntegrityResult = MatchDomainService.tryVerifyIntegrity(match);
        if (matchIntegrityResult.isErr()) {
            return err(matchIntegrityResult.error);
        }

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

        const matchIntegrityResult = MatchDomainService.tryVerifyIntegrity(match);
        if (matchIntegrityResult.isErr()) {
            return err(matchIntegrityResult.error);
        }

        return ok(true);
    }

    public static tryMarkCancelled(match: Match): Result<true, IDomainError[]> {
        const statusResult = match.tryTransitionStatus(MatchStatus.CANCELLED.value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        const matchIntegrityResult = MatchDomainService.tryVerifyIntegrity(match);
        if (matchIntegrityResult.isErr()) {
            return err(matchIntegrityResult.error);
        }

        return ok(true);
    }
}

export default MatchDomainService;

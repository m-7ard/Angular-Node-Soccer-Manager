import MatchFactory from "domain/domainFactories/MatchFactory";
import Match from "domain/entities/Match";
import Team from "domain/entities/Team";
import DomainErrorFactory from "domain/errors/DomainErrorFactory";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import { err, ok, Result } from "neverthrow";
import dateDiff from "utils/dateDifference";

class MatchDomainService {
    public static tryVerifyIntegrity(match: Match): Result<true, IDomainError[]> {
        if (match.homeTeamId === match.awayTeamId) {
            return err(
                DomainErrorFactory.createSingleListError({
                    message: "Home team cannot be the same as the away team",
                    code: "INTEGRITY_ERROR",
                    path: ["_"],
                }),
            );
        }

        if (match.status === MatchStatus.SCHEDULED) {
            if (match.startDate != null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A scheduled match cannot have a startDate",
                        code: "INTEGRITY_ERROR",
                        path: ["startDate"],
                    }),
                );
            }

            if (match.endDate != null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A scheduled match cannot have an endDate",
                        code: "INTEGRITY_ERROR",
                        path: ["endDate"],
                    }),
                );
            }

            if (match.score != null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A scheduled match cannot have a score",
                        code: "INTEGRITY_ERROR",
                        path: ["score"],
                    }),
                );
            }
        }

        if (match.status === MatchStatus.IN_PROGRESS) {
            if (match.startDate == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "An in-progress match cannot have a null startDate",
                        code: "INTEGRITY_ERROR",
                        path: ["startDate"],
                    }),
                );
            }

            if (match.endDate != null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "An in-progress match cannot have an endDate",
                        code: "INTEGRITY_ERROR",
                        path: ["endDate"],
                    }),
                );
            }

            if (match.score == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "An in-progress match cannot have a null score",
                        code: "INTEGRITY_ERROR",
                        path: ["score"],
                    }),
                );
            }

            if (match.startDate < match.scheduledDate) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "An in-progress match cannot start before its scheduledDate",
                        code: "INTEGRITY_ERROR",
                        path: ["startDate"],
                    }),
                );
            }
        }

        if (match.status === MatchStatus.COMPLETED) {
            if (match.startDate == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A completed match cannot have a null startDate",
                        code: "INTEGRITY_ERROR",
                        path: ["startDate"],
                    }),
                );
            }

            if (match.endDate == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A completed match cannot have a null endDate",
                        code: "INTEGRITY_ERROR",
                        path: ["endDate"],
                    }),
                );
            }

            if (match.score == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A completed match cannot have a null score",
                        code: "INTEGRITY_ERROR",
                        path: ["score"],
                    }),
                );
            }

            if (dateDiff(match.startDate, match.endDate, "minutes") < 90) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A completed match must have a duration of at least 90 minutes",
                        code: "INTEGRITY_ERROR",
                        path: ["endDate"],
                    }),
                );
            }
        }

        if (match.status === MatchStatus.CANCELLED) {
            if (match.startDate != null && match.score == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A cancelled match with a startDate must also have a score",
                        code: "INTEGRITY_ERROR",
                        path: ["score"],
                    }),
                );
            }

            if (match.score != null && match.startDate == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: "A cancelled match with a score must also have a startDate",
                        code: "INTEGRITY_ERROR",
                        path: ["startDate"],
                    }),
                );
            }

            if (match.startDate != null && match.endDate != null) {
                const duration = dateDiff(match.startDate, match.endDate, "minutes");
                if (duration < 90) {
                    return err(
                        DomainErrorFactory.createSingleListError({
                            message: "A cancelled match with a startDate and endDate must have a duration of at least 90 minutes",
                            code: "INTEGRITY_ERROR",
                            path: ["endDate"],
                        }),
                    );
                }
            }
        }

        return ok(true);
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
        score: {
            homeTeamScore: number;
            awayTeamScore: number;
        } | null;
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

        let score: MatchScore | null = null;
        if (props.score != null) {
            const scoreResult = MatchScore.tryCreate({ awayTeamScore: props.score.awayTeamScore, homeTeamScore: props.score.homeTeamScore });
            if (scoreResult.isErr()) {
                return err(
                    scoreResult.error.map((message) => ({
                        message: message,
                        path: ["score"],
                        code: "INVALID_SCORE",
                    })),
                );
            }

            score = scoreResult.value;
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
            score: score,
        });

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

        const startScoreResult = match.trySetScore({ homeTeamScore: 0, awayTeamScore: 0 });
        if (startScoreResult.isErr()) {
            return err(startScoreResult.error);
        }

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

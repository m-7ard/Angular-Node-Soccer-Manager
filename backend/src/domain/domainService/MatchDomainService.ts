import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import MatchFactory from "domain/domainFactories/MatchFactory";
import Match from "domain/entities/Match";
import Team from "domain/entities/Team";
import DomainErrorFactory from "domain/errors/DomainErrorFactory";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import { err, ok, Result } from "neverthrow";

class MatchDomainService {
    public static tryCreateMatch(props: {
        id: string;
        homeTeam: Team;
        awayTeam: Team;
        venue: string;
        scheduledDate: Date;
        startTime: Date;
        endTime: Date | null;
        status: string;
        homeTeamScore: number | null;
        awayTeamScore: number | null;
    }): Result<Match, IDomainError[]> {
        const match = MatchFactory.CreateNew({
            id: props.id,
            homeTeamId: props.homeTeam.id,
            awayTeamId: props.awayTeam.id,
            venue: props.venue,
            scheduledDate: props.scheduledDate,
            startTime: props.startTime,
        });

        // Try to set the status of the match, return error if setting status fails
        const statusResult = match.trySetStatus(props.status);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        // If the match is completed, validate that endTime is provided
        if (match.status === MatchStatus.COMPLETED) {
            if (props.endTime == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: `A completed match cannot have a null endTime.`,
                        code: "INVALID_END_TIME",
                        path: ["endTime"],
                    }),
                );
            }

            // Set the endTime and return error if setting endTime fails
            const endTimeResult = match.trySetEndTime(props.endTime);
            if (endTimeResult.isErr()) {
                return err(endTimeResult.error);
            }
        }

        // If the match can have scores, ensure both home and away team scores are provided
        if (match.canHaveScore()) {
            if (props.homeTeamScore == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: `Home Team Score cannot be null when status is ${match.status.value}.`,
                        code: "INVALID_SCORE",
                        path: ["homeTeamScore"],
                    }),
                );
            }

            if (props.awayTeamScore == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: `Away Team Score cannot be null when status is ${match.status.value}.`,
                        code: "INVALID_SCORE",
                        path: ["awayTeamScore"],
                    }),
                );
            }

            // Set the scores for the match and return error if setting the scores fails
            const scoreResult = match.trySetScore({ homeTeamScore: props.homeTeamScore, awayTeamScore: props.awayTeamScore });
            if (scoreResult.isErr()) {
                return err(scoreResult.error);
            }
        }

        return ok(match);
    }
}

export default MatchDomainService;

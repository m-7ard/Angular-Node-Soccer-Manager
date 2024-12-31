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
        startDate: Date;
        endDate: Date | null;
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
            startDate: props.startDate,
        });

        // Try to set the status of the match, return error if setting status fails
        const statusResult = match.trySetStatus(props.status);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        // If the match is completed, validate that endDate is provided
        if (match.status === MatchStatus.COMPLETED) {
            if (props.endDate == null) {
                return err(
                    DomainErrorFactory.createSingleListError({
                        message: `A completed match cannot have a null endDate.`,
                        code: "INVALID_END_DATE",
                        path: ["endDate"],
                    }),
                );
            }

            // Set the endDate and return error if setting endDate fails
            const endDateResult = match.trySetEndDate(props.endDate);
            if (endDateResult.isErr()) {
                return err(endDateResult.error);
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

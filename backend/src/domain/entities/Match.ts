import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import Team from "./Team";
import MatchEvent from "./MatchEvent";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import { err, ok, Result } from "neverthrow";
import dateDiff from "utils/dateDifference";
import DomainErrorFactory from "domain/errors/DomainErrorFactory";

type MatchProps = {
    id: string;
    homeTeamId: Team["id"];
    awayTeamId: Team["id"];
    venue: string;
    scheduledDate: Date;
    startDate: Date;
    endDate: Date | null;
    status: MatchStatus;
    score: MatchScore | null;
    events: MatchEvent[];
    createdAt: Date;
    updatedAt: Date;
};

class Match {
    private readonly __type: "MATCH_DOMAIN" = null!;

    public id: string;
    public homeTeamId: Team["id"];
    public awayTeamId: Team["id"];
    public venue: string;
    public scheduledDate: Date;
    public startDate: Date;
    public endDate: Date | null;
    public status: MatchStatus;
    public score: MatchScore | null;
    public events: MatchEvent[];
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: MatchProps) {
        this.id = props.id;
        this.homeTeamId = props.homeTeamId;
        this.awayTeamId = props.awayTeamId;
        this.venue = props.venue;
        this.scheduledDate = props.scheduledDate;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.status = props.status;
        this.score = props.score;
        this.createdAt = props.createdAt;
        this.events = props.events;
        this.updatedAt = props.updatedAt;
        this.updatedAt = props.updatedAt;
    }

    private isValidStatusTransitions = (newStatus: MatchStatus) => {
        if (this.status === MatchStatus.SCHEDULED) {
            return true;
        } else if (this.status === MatchStatus.SCHEDULED) {
            return [MatchStatus.IN_PROGRESS, MatchStatus.CANCELLED].includes(newStatus);
        } else if (this.status === MatchStatus.IN_PROGRESS) {
            return [MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(newStatus);
        }

        return false;
    };

    public trySetStatus(value: string): Result<true, IDomainError[]> {
        const statusResult = MatchStatus.tryCreate(value);

        if (statusResult.isErr()) {
            return err(DomainErrorFactory.createSingleListError({ message: statusResult.error, path: ["status"], code: "INVALID_STATUS" }));
        }

        const newStatus = statusResult.value;

        if (!this.isValidStatusTransitions(newStatus)) {
            return err(
                DomainErrorFactory.createSingleListError({
                    message: `Invalid status transition from ${this.status} to ${newStatus}`,
                    path: ["status"],
                    code: "INVALID_TRANSITION",
                }),
            );
        }

        this.status = newStatus;
        return ok(true);
    }

    public trySetScore(value: { homeTeamScore: number; awayTeamScore: number }): Result<true, IDomainError[]> {
        if (!this.canHaveScore()) {
            return err(
                DomainErrorFactory.createSingleListError({
                    message: `Cannot set score when match status is ${this.status}`,
                    path: ["score"],
                    code: "INVALID_SCORE",
                }),
            );
        }

        const scoreResult = MatchScore.tryCreate({ awayTeamScore: value.awayTeamScore, homeTeamScore: value.homeTeamScore });
        if (scoreResult.isErr()) {
            const errors: IDomainError[] = scoreResult.error.map((error) => ({ code: "INVALID_SCORE", message: error, path: ["score"] }));
            return err(errors);
        }

        return ok(true);
    }

    public trySetEndDate(value: Date): Result<true, IDomainError[]> {
        if (this.status !== MatchStatus.COMPLETED) {
            return err(DomainErrorFactory.createSingleListError({ message: "endDate can only be set on a completed match.", code: "MATCH_NOT_COMPLETED", path: ["endDate"] }));
        }

        if (dateDiff(value, this.startDate, "minutes") < 90) {
            return err(DomainErrorFactory.createSingleListError({ message: "endDate must be at least 90 minutes greater than startDate.", code: "END_DATE_TOO_SMALL", path: ["endDate"] }));
        }

        this.endDate = value;
        return ok(true);
    }

    public canHaveScore() {
        return [MatchStatus.IN_PROGRESS, MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(this.status);
    }
}

export default Match;
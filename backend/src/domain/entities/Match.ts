import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import Team from "./Team";
import MatchEvent from "./MatchEvent";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import { err, ok, Result } from "neverthrow";
import dateDiff from "utils/dateDifference";
import DomainErrorFactory from "domain/errors/DomainErrorFactory";
import Player from "./Player";
import MatchEventFactory from "domain/domainFactories/MatchEventFactory";
import MatchEventType from "domain/valueObjects/MatchEvent/MatchEventType";
import DomainEvent from "domain/domainEvents/DomainEvent";
import MatchEventPendingCreationEvent from "domain/domainEvents/Match/MatchEventPendingCreationEvent";

type MatchProps = {
    id: string;
    homeTeamId: Team["id"];
    awayTeamId: Team["id"];
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
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
    public startDate: Date | null;
    public endDate: Date | null;
    public status: MatchStatus;
    public score: MatchScore | null;
    public events: MatchEvent[];
    public createdAt: Date;
    public updatedAt: Date;

    public domainEvents: DomainEvent[] = [];
    clearEvents = () => {
        this.domainEvents = [];
    };

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
            return [MatchStatus.IN_PROGRESS, MatchStatus.CANCELLED].includes(newStatus);
        } else if (this.status === MatchStatus.IN_PROGRESS) {
            return [MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(newStatus);
        } else if (this.status === MatchStatus.COMPLETED) {
            return [MatchStatus.CANCELLED].includes(newStatus);
        }

        return false;
    };

    public tryTransitionStatus(value: string): Result<true, IDomainError[]> {
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

    public trySetStatus(value: string): Result<true, IDomainError[]> {
        const statusResult = MatchStatus.tryCreate(value);

        if (statusResult.isErr()) {
            return err(DomainErrorFactory.createSingleListError({ message: statusResult.error, path: ["status"], code: "INVALID_STATUS" }));
        }

        const newStatus = statusResult.value;

        this.status = newStatus;
        return ok(true);
    }

    public trySetEndDate(value: Date): Result<true, IDomainError[]> {
        if (this.status !== MatchStatus.COMPLETED) {
            return err(DomainErrorFactory.createSingleListError({ message: "endDate can only be set on a completed match.", code: "MATCH_NOT_COMPLETED", path: ["endDate"] }));
        }

        if (this.startDate == null) {
            return err(DomainErrorFactory.createSingleListError({ message: "endDate cannot be set when startDate is null.", code: "NULL_START_DATE", path: ["startDate"] }));
        }

        if (dateDiff(value, this.startDate, "minutes") < 90) {
            return err(DomainErrorFactory.createSingleListError({ message: "endDate must be at least 90 minutes greater than startDate.", code: "END_DATE_TOO_SMALL", path: ["endDate"] }));
        }

        this.endDate = value;
        return ok(true);
    }

    public trySetStartDate(value: Date): Result<true, IDomainError[]> {
        if (this.status !== MatchStatus.IN_PROGRESS) {
            return err(DomainErrorFactory.createSingleListError({ message: "startDate can only be set on a in progress match.", code: "MATCH_NOT_COMPLETED", path: ["startDate"] }));
        }

        if (value < this.scheduledDate) {
            return err(DomainErrorFactory.createSingleListError({ message: "startDate cannot be smaller than the scheduled date.", code: "START_DATE_TOO_SMALL", path: ["startDate"] }));
        }

        this.startDate = value;
        return ok(true);
    }

    public canHaveScore() {
        return [MatchStatus.IN_PROGRESS, MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(this.status);
    }

    public canAddGoal(props: { dateOccured: Date; teamId: string; playerId: string }): Result<{ score: MatchScore }, string> {
        if (!this.canHaveScore()) {
            return err(`Cannot add a goal to a match that cannot have a score.`);
        }

        if (this.score == null) {
            return err(`Score cannot be null when adding a goal.`);
        }

        if (this.startDate == null) {
            return err(`Cannot add goals when startDate is null.`);
        }

        if (props.dateOccured < this.startDate) {
            return err(`Date occured cannot be less than start date.`);
        }

        if (this.endDate != null && props.dateOccured > this.endDate) {
            return err(`Date occured cannot be more than end date.`);
        }

        if (props.teamId !== this.homeTeamId && props.teamId !== this.awayTeamId) {
            return err(`Goal team does not match teams from match.`);
        }

        return ok({ score: this.score });
    }

    public executeAddGoal(props: { dateOccured: Date; teamId: string; playerId: string }): void {
        const canAddGoalResult = this.canAddGoal(props);
        if (canAddGoalResult.isErr()) {
            throw new Error(canAddGoalResult.error);
        }

        const { score } = canAddGoalResult.value;

        const matchEvent = MatchEventFactory.CreateNew({
            id: crypto.randomUUID(),
            matchId: this.id,
            playerId: props.playerId,
            teamId: props.teamId,
            type: MatchEventType.GOAL,
            dateOccured: props.dateOccured,
            secondaryPlayerId: null,
            description: "",
        });

        this.events.push(matchEvent);
        this.domainEvents.push(new MatchEventPendingCreationEvent(matchEvent));

        const isHomeTeamGoal = props.teamId === this.homeTeamId;
        this.score = MatchScore.executeCreate({
            homeTeamScore: isHomeTeamGoal ? score.homeTeamScore + 1 : score.homeTeamScore,
            awayTeamScore: isHomeTeamGoal ? score.awayTeamScore : score.awayTeamScore + 1,
        });
    }

    public getGoals() {
        return this.events.filter((event) => event.type === MatchEventType.GOAL);
    }
}

export default Match;

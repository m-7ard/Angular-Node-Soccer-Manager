import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import Team from "./Team";
import MatchEvent from "./MatchEvent";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import { err, ok, Result } from "neverthrow";
import MatchEventFactory from "domain/domainFactories/MatchEventFactory";
import MatchEventType from "domain/valueObjects/MatchEvent/MatchEventType";
import DomainEvent from "domain/domainEvents/DomainEvent";
import MatchEventPendingCreationEvent from "domain/domainEvents/Match/MatchEventPendingCreationEvent";
import MatchDates from "domain/valueObjects/Match/MatchDates";

type MatchProps = {
    id: string;
    homeTeamId: Team["id"];
    awayTeamId: Team["id"];
    venue: string;
    matchDates: MatchDates;
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
    public matchDates: MatchDates;
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
        this.matchDates = props.matchDates;
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

    public canTransitionStatus(value: string): Result<MatchStatus, string> {
        const statusResult = MatchStatus.canCreate(value);
        if (statusResult.isErr()) {
            return err(statusResult.error);
        }

        const newStatus = statusResult.value;

        if (!this.isValidStatusTransitions(newStatus)) {
            return err(`Invalid status transition from ${this.status.value} to ${newStatus.value}`);
        }

        return ok(newStatus);
    }

    public executeTransitionStatus(value: string): void {
        const canTransitionStatusResult = this.canTransitionStatus(value);
        if (canTransitionStatusResult.isErr()) {
            throw new Error(canTransitionStatusResult.error);
        }

        this.status = canTransitionStatusResult.value;
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

        if (this.matchDates.startDate == null) {
            return err(`Cannot add goals when startDate is null.`);
        }

        if (props.dateOccured < this.matchDates.startDate) {
            return err(`Date occured cannot be less than start date.`);
        }

        if (this.matchDates.endDate != null && props.dateOccured > this.matchDates.endDate) {
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

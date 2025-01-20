import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import MatchEvent from "./MatchEvent";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import { err, ok, Result } from "neverthrow";
import MatchEventFactory from "domain/domainFactories/MatchEventFactory";
import MatchEventType from "domain/valueObjects/MatchEvent/MatchEventType";
import DomainEvent from "domain/domainEvents/DomainEvent";
import MatchEventPendingCreationEvent from "domain/domainEvents/Match/MatchEventPendingCreationEvent";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import TeamId from "domain/valueObjects/Team/TeamId";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import Team from "./Team";
import Player from "./Player";

type MatchProps = {
    id: string;
    homeTeamId: TeamId;
    awayTeamId: TeamId;
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
    public homeTeamId: TeamId;
    public awayTeamId: TeamId;
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
        this.events = props.events.sort(((a, b) => a.dateOccured.getTime() - b.dateOccured.getTime()));
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

    public canAddGoal(props: { dateOccured: Date; team: Team; player: Player }): Result<{ score: MatchScore }, string> {
        const { dateOccured, team, player } = props;

        if (!this.canHaveScore()) {
            return err(`Cannot add a goal to a match that cannot have a score.`);
        }

        if (this.score == null) {
            return err(`Score cannot be null when adding a goal.`);
        }

        if (this.matchDates.startDate == null) {
            return err(`Cannot add goals when startDate is null.`);
        }

        if (dateOccured < this.matchDates.startDate) {
            return err(`Date occured cannot be less than start date.`);
        }

        if (this.matchDates.endDate != null && dateOccured > this.matchDates.endDate) {
            return err(`Date occured cannot be more than end date.`);
        }

        if (!team.id.equals(this.homeTeamId) && !team.id.equals(this.awayTeamId)) {
            return err(`Goal team does not match teams from match.`);
        }

        const teamMemberships = team.filterMembersByPlayerId(player.id);
        if (teamMemberships.length === 0) {
            return err(`Goal player does not have a membership in the goal team.`);
        }

        if (!teamMemberships.some((membership) => membership.teamMembershipDates.isWithinRange(dateOccured))) {
            return err(`Goal must occur while player was / is a member.`);
        }

        return ok({ score: this.score });
    }

    public executeAddGoal(props: { dateOccured: Date; team: Team; player: Player }): void {
        const canAddGoalResult = this.canAddGoal(props);
        if (canAddGoalResult.isErr()) {
            throw new Error(canAddGoalResult.error);
        }

        const { score } = canAddGoalResult.value;

        const matchEvent = MatchEventFactory.CreateNew({
            id: crypto.randomUUID(),
            matchId: this.id,
            playerId: props.player.id,
            teamId: props.team.id,
            type: MatchEventType.GOAL,
            dateOccured: props.dateOccured,
            secondaryPlayerId: null,
            description: "",
        });

        this.events.push(matchEvent);
        this.domainEvents.push(new MatchEventPendingCreationEvent(matchEvent));

        const isHomeTeamGoal = props.team.id.equals(this.homeTeamId);
        this.score = MatchScore.executeCreate({
            homeTeamScore: isHomeTeamGoal ? score.homeTeamScore + 1 : score.homeTeamScore,
            awayTeamScore: isHomeTeamGoal ? score.awayTeamScore : score.awayTeamScore + 1,
        });
    }

    public getGoals() {
        return this.events.filter((event) => event.type === MatchEventType.GOAL);
    }

    public isMatchTeam(teamId: TeamId): boolean {
        return this.homeTeamId.equals(teamId) || this.awayTeamId.equals(teamId);
    }
}

export default Match;

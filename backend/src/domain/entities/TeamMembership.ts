import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembershipHistory from "./TeamMembershipHistory";
import TeamMembershipHistoryNumber from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryNumber";
import { number } from "superstruct";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import { err, ok, Result } from "neverthrow";
import TeamMembershipHistoryFactory from "domain/domainFactories/TeamMembershipHistoryFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipHistoryPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingCreationEvent";

class TeamMembership {
    private readonly __type: "TEAM_MEMBERSHIP_DOMAIN" = null!;

    constructor({
        id,
        teamId,
        playerId,
        teamMembershipHistories,
        teamMembershipDates,
    }: {
        id: string;
        teamId: string;
        playerId: string;
        teamMembershipHistories: TeamMembershipHistory[];
        teamMembershipDates: TeamMembershipDates;
    }) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.teamMembershipHistories = teamMembershipHistories;
        this.teamMembershipDates = teamMembershipDates;
    }

    private domainEvents: DomainEvent[] = [];
    public pullDomainEvent() {
        const domainEvents = [...this.domainEvents];
        this.domainEvents = [];
        return domainEvents;
    }

    public isActive() {
        return this.teamMembershipDates.activeTo == null;
    }

    public getEffectiveHistory() {
        return this.teamMembershipHistories.filter((teamMembershipHistory) => teamMembershipHistory.isEffective()).sort((a, b) => b.dateEffectiveFrom.getTime() - a.dateEffectiveFrom.getTime())[0];
    }

    public canAddHistory(props: { dateEffectiveFrom: Date; number: number; position: string }): Result<boolean, string> {
        const numberResult = TeamMembershipHistoryNumber.canCreate(props.number);
        if (numberResult.isErr()) {
            return err(numberResult.error);
        }

        const positionResult = TeamMembershipHistoryPosition.canCreate(props.position);
        if (positionResult.isErr()) {
            return err(positionResult.error);
        }

        return ok(true);
    }

    public executeAddHistory(props: { dateEffectiveFrom: Date; number: number; position: string }): Result<boolean, string> {
        const canAddHistoryResult = this.canAddHistory(props);
        if (canAddHistoryResult.isErr()) {
            return err(canAddHistoryResult.error);
        }

        const history = TeamMembershipHistoryFactory.CreateNew({
            id: crypto.randomUUID(),
            dateEffectiveFrom: props.dateEffectiveFrom,
            teamMembershipId: this.id,
            positionValueObject: TeamMembershipHistoryPosition.executeCreate(props.position),
            numberValueObject: TeamMembershipHistoryNumber.executeCreate(props.number),
        });

        this.teamMembershipHistories.push(history);
        this.domainEvents.push(new TeamMembershipHistoryPendingCreationEvent(history));

        return ok(true);
    }

    public id: string;
    public teamId: string;
    public playerId: string;
    public teamMembershipDates: TeamMembershipDates;
    public teamMembershipHistories: TeamMembershipHistory[];
}

export default TeamMembership;

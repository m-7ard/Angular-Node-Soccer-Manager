import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembershipHistory from "./TeamMembershipHistory";
import TeamMembershipHistoryNumber from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryNumber";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import { err, ok, Result } from "neverthrow";
import TeamMembershipHistoryFactory from "domain/domainFactories/TeamMembershipHistoryFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipHistoryPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingCreationEvent";
import TeamId from "domain/valueObjects/Team/TeamId";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";
import TeamMembershipHistoryPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipHistoryPendingUpdatingEvent";

interface Props {
    id: TeamMembershipId;
    teamId: TeamId;
    playerId: PlayerId;
    teamMembershipHistories: TeamMembershipHistory[];
    teamMembershipDates: TeamMembershipDates;
}

class TeamMembership implements Props {
    private readonly __type: "TEAM_MEMBERSHIP_DOMAIN" = null!;

    constructor({ id, teamId, playerId, teamMembershipHistories, teamMembershipDates }: Props) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.teamMembershipHistories = teamMembershipHistories.sort((a, b) => b.dateEffectiveFrom.getTime() - a.dateEffectiveFrom.getTime());
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

    public getEffectiveHistory(): TeamMembershipHistory | null {
        const effectiveHistory = this.getEffectiveHistoryForDate(new Date());
        return effectiveHistory;
    }

    public getEffectiveHistoryForDate(date: Date): TeamMembershipHistory | null {
        let left = 0;
        let right = this.teamMembershipHistories.length - 1;
        let result: TeamMembershipHistory | null = null;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const currentHistory = this.teamMembershipHistories[mid];
            const nextHistory = mid > 0 ? this.teamMembershipHistories[mid - 1] : null;

            if (currentHistory.dateEffectiveFrom <= date) {
                if (nextHistory == null || nextHistory.dateEffectiveFrom > date) {
                    result = currentHistory;
                    break;
                }
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return result;
    }

    public canAddHistory(props: { dateEffectiveFrom: Date; number: number; position: string }): Result<boolean, string> {
        const tryVerifyHistoryIntegrityResult = this.tryVerifyHistoryIntegrity(props);
        if (tryVerifyHistoryIntegrityResult.isErr()) {
            return err(tryVerifyHistoryIntegrityResult.error);
        }

        return ok(true);
    }

    public executeAddHistory(props: { id: TeamMembershipHistoryId; dateEffectiveFrom: Date; number: number; position: string }): Result<boolean, string> {
        const canAddHistoryResult = this.canAddHistory(props);
        if (canAddHistoryResult.isErr()) {
            return err(canAddHistoryResult.error);
        }

        const history = TeamMembershipHistoryFactory.CreateNew({
            id: props.id,
            dateEffectiveFrom: props.dateEffectiveFrom,
            teamMembershipId: this.id,
            positionValueObject: TeamMembershipHistoryPosition.executeCreate(props.position),
            numberValueObject: TeamMembershipHistoryNumber.executeCreate(props.number),
        });

        this.teamMembershipHistories.push(history);
        this.domainEvents.push(new TeamMembershipHistoryPendingCreationEvent(history));

        return ok(true);
    }

    public tryFindHistoryById(id: TeamMembershipHistoryId): Result<TeamMembershipHistory, string> {
        const teamMembershipHistory = this.teamMembershipHistories.find((teamMembershipHistory) => teamMembershipHistory.id.equals(id));
        if (teamMembershipHistory == null) {
            return err(`Team Membership History of id "${id}" does not exist on Team Membership of id "${this.id}".`);
        }

        return ok(teamMembershipHistory);
    }

    public executeFindHistoryById(id: TeamMembershipHistoryId) {
        const tryFindHistoryByIdResult = this.tryFindHistoryById(id);
        if (tryFindHistoryByIdResult.isErr()) {
            throw new Error(tryFindHistoryByIdResult.error);
        }

        return tryFindHistoryByIdResult.value;
    }

    public filterHistories(criteria: { dateEffectiveFromAfter: Date | null }) {
        let results = [...this.teamMembershipHistories];
        if (criteria.dateEffectiveFromAfter != null) {
            const date = criteria.dateEffectiveFromAfter;
            results = results.filter((history) => history.dateEffectiveFrom > date);
        }

        return results;
    }

    private tryVerifyHistoryIntegrity(props: { dateEffectiveFrom: Date; number: number; position: string }): Result<true, string> {
        if (!this.teamMembershipDates.isWithinRange(props.dateEffectiveFrom)) {
            return err(`History's dateEffectiveFrom must be within the Membership's activeFrom and activeTo date range.`);
        }

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

    public canUpdateHistory(teamMembershipHistoryId: TeamMembershipHistoryId, props: { dateEffectiveFrom: Date; number: number; position: string }): Result<boolean, string> {
        const tryFindHistoryResult = this.tryFindHistoryById(teamMembershipHistoryId);
        if (tryFindHistoryResult.isErr()) {
            return err(tryFindHistoryResult.error);
        }

        const tryVerifyHistoryIntegrityResult = this.tryVerifyHistoryIntegrity(props);
        if (tryVerifyHistoryIntegrityResult.isErr()) {
            return err(tryVerifyHistoryIntegrityResult.error);
        }

        return ok(true);
    }

    public executeUpdateHistory(teamMembershipHistoryId: TeamMembershipHistoryId, props: { dateEffectiveFrom: Date; number: number; position: string }): Result<boolean, string> {
        const canUpdateHistoryResult = this.canUpdateHistory(teamMembershipHistoryId, props);
        if (canUpdateHistoryResult.isErr()) {
            return err(canUpdateHistoryResult.error);
        }

        const teamMembershipHistory = this.executeFindHistoryById(teamMembershipHistoryId);
        teamMembershipHistory.dateEffectiveFrom = props.dateEffectiveFrom;
        teamMembershipHistory.numberValueObject = TeamMembershipHistoryNumber.executeCreate(props.number);
        teamMembershipHistory.positionValueObject = TeamMembershipHistoryPosition.executeCreate(props.position);

        this.domainEvents.push(new TeamMembershipHistoryPendingUpdatingEvent(teamMembershipHistory));
        return ok(true);
    }

    public isConflictingDate(date: TeamMembershipDates): boolean {
        const activeFromOverlaps = this.teamMembershipDates.isWithinRange(date.activeFrom);
        if (activeFromOverlaps) return true;

        const activeToOverlaps = date.activeTo != null ? this.teamMembershipDates.isWithinRange(date.activeTo) : false;
        if (activeToOverlaps) return true;

        const futureMembershipExists = date.activeTo == null ? this.teamMembershipDates.activeFrom >= date.activeFrom : false;
        if (futureMembershipExists) return true;

        return false;
    }

    public id: TeamMembershipId;
    public teamId: TeamId;
    public playerId: PlayerId;
    public teamMembershipDates: TeamMembershipDates;
    public teamMembershipHistories: TeamMembershipHistory[];
}

export default TeamMembership;

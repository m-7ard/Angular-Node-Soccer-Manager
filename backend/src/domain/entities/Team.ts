import { Err, err, ok, Result } from "neverthrow";
import TeamMembership from "./TeamMembership";
import TeamMembershipFactory from "domain/domainFactories/TeamMembershipFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipPendingCreationEvent";
import Player from "./Player";
import TeamMembershipPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipPendingDeletionEvent";
import TeamMembershipPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipPendingUpdatingEvent";
import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";

class Team {
    private readonly __type: "TEAM_DOMAIN" = null!;
    domainEvents: DomainEvent[] = [];
    clearEvents = () => {
        this.domainEvents = [];
    };

    constructor({ id, name, dateFounded, teamMemberships }: { id: TeamId; name: string; dateFounded: Date; teamMemberships: TeamMembership[] }) {
        this.id = id;
        this.name = name;
        this._dateFounded = dateFounded;
        this.teamMemberships = teamMemberships;
    }

    public id: TeamId;
    public name: string;
    private _dateFounded: Date;
    public teamMemberships: TeamMembership[];

    public get dateFounded() {
        return this._dateFounded;
    }

    private set dateFounded(value: Date) {
        this._dateFounded = value;
    }

    public canUpdateDateFounded(value: Date): Result<true, string> {
        const conflictingTeamMembership = this.teamMemberships.find((teamMembership) => teamMembership.teamMembershipDates.activeFrom < value);

        if (conflictingTeamMembership != null) {
            return err(`Team's date founded (${value}) cannot be greater than one of its Memberships' active from dates (${conflictingTeamMembership.teamMembershipDates.activeFrom}).`);
        }

        return ok(true);
    }

    public executeUpdateDateFounded(value: Date) {
        const canUpdateDateFounded = this.canUpdateDateFounded(value);
        if (canUpdateDateFounded.isErr()) {
            throw new Error(canUpdateDateFounded.error);
        }

        this.dateFounded = value;
    }

    private findMemberByPlayerId(playerId: PlayerId) {
        return this.teamMemberships.find((membership) => membership.playerId.equals(playerId));
    }

    public filterMembersByPlayerId(playerId: PlayerId) {
        return this.teamMemberships.filter((membership) => membership.playerId.equals(playerId));
    }

    public findMemberByPlayerIdOrNull(playerId: PlayerId) {
        return this.teamMemberships.find((membership) => membership.playerId.equals(playerId));
    }

    public findMemberById(teamMembershipId: TeamMembershipId) {
        return this.teamMemberships.find((membership) => membership.id.equals(teamMembershipId));
    }

    public tryFindMemberById(teamMembershipId: TeamMembershipId): Result<TeamMembership, string> {
        const teamMembership = this.findMemberById(teamMembershipId);
        if (teamMembership == null) {
            return err(`Team Membership of id "${teamMembershipId.value} does not exist on Team of id ${this.id}"`);
        }

        return ok(teamMembership);
    }

    public executeFindMemberById(teamMembershipId: TeamMembershipId): TeamMembership {
        const canFindTeamMemberbyIdResult = this.tryFindMemberById(teamMembershipId);
        if (canFindTeamMemberbyIdResult.isErr()) {
            throw new Error(canFindTeamMemberbyIdResult.error);
        }

        return canFindTeamMemberbyIdResult.value;
    }

    public findActiveMemberByPlayerId(playerId: PlayerId) {
        const membership = this.findMemberByPlayerId(playerId);
        if (membership == null) {
            return null;
        }

        if (membership.isActive()) {
            return membership;
        }

        return null;
    }

    private tryVerifyMemberIntegrity(
        teamMembership: TeamMembership | null,
        player: Player,
        props: {
            activeFrom: Date;
            activeTo: Date | null;
        },
    ): Result<true, string> {
        // Create dates
        const canCreateTeamMembershipDatesResult = TeamMembershipDates.canCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });
        if (canCreateTeamMembershipDatesResult.isErr()) {
            return err(canCreateTeamMembershipDatesResult.error);
        }

        const teamMembershipDates = TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });

        // Is overlapping / conflicting date
        const playerTeamMemberships = this.filterMembersByPlayerId(player.id);
        const conflictsWithMembership = playerTeamMemberships.find((playerMembership) => {
            if (playerMembership === teamMembership) return false;
            return playerMembership.isConflictingDate(teamMembershipDates);
        });

        if (conflictsWithMembership != null) {
            return err(
                `Team Member's active dates (${props.activeFrom} to ${props.activeTo}) overlap with an existing team membership active from ${conflictsWithMembership.teamMembershipDates.activeFrom} to ${conflictsWithMembership.teamMembershipDates.activeTo}. Please choose a date range that does not conflict with existing memberships.`,
            );
        }

        // Is membership activeFrom before team was founded
        if (props.activeFrom < this._dateFounded) {
            return err(`Team Member's activeFrom (${props.activeFrom}) cannot be before the team's dateFounded (${this._dateFounded}).`);
        }

        // Is membership activeFrom before player was active
        if (player.activeSince > props.activeFrom) {
            return err(`Team Member's activeFrom ${props.activeFrom} cannot be before the player's activeFrom (${player.activeSince}).`);
        }

        // Are there upcoming teamMembershipHistories
        if (props.activeTo != null && teamMembership != null) {
            const upcomingMemberHistories = teamMembership.filterHistories({ dateEffectiveFromAfter: props.activeTo });
            if (upcomingMemberHistories.length) {
                const requiredDate = Math.max(...upcomingMemberHistories.map(({ dateEffectiveFrom }) => dateEffectiveFrom.getTime()));
                const requiredDateString = new Date(requiredDate).toJSON();

                return err(
                    `Team Member's activeTo date must be null while it has Team Membership Histories with a dateEffectiveFrom greater than the activeTo, make sure to delete them or set activeTo to a date equal or greater than ${requiredDateString}.`,
                );
            }
        }

        return ok(true);
    }

    public canAddMember(props: { id: string; player: Player; activeFrom: Date; activeTo: Date | null }): Result<boolean, string> {
        // Create id
        const canCreateIdResult = TeamMembershipId.canCreate(props.id);
        if (canCreateIdResult.isErr()) {
            return err(canCreateIdResult.error);
        }

        const id = TeamMembershipId.executeCreate(props.id);

        // Does membership already exist
        const membershipById = this.findMemberById(id);
        if (membershipById != null) {
            return err(`Membership with id "${id}" already exists on the team.`);
        }

        const canVerifyIntegrityResult = this.tryVerifyMemberIntegrity(null, props.player, { activeFrom: props.activeFrom, activeTo: props.activeTo });
        if (canVerifyIntegrityResult.isErr()) {
            return err(canVerifyIntegrityResult.error);
        }

        return ok(true);
    }

    public executeAddMember(props: { id: string; player: Player; activeFrom: Date; activeTo: Date | null }): TeamMembershipId {
        const canAddMemberResult = this.canAddMember(props);
        if (canAddMemberResult.isErr()) {
            throw new Error(canAddMemberResult.error);
        }

        const teamMembership = TeamMembershipFactory.CreateNew({
            id: TeamMembershipId.executeCreate(props.id),
            teamId: this.id,
            playerId: props.player.id,
            teamMembershipDates: TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo }),
        });

        this.teamMemberships.push(teamMembership);
        this.domainEvents.push(new TeamMembershipPendingCreationEvent(teamMembership));
        return teamMembership.id;
    }

    public canUpdateMember(teamMembershipId: TeamMembershipId, player: Player, props: { activeFrom: Date; activeTo: Date | null }): Result<true, string> {
        // Does membership exist
        const tryFindTeamMemberResult = this.tryFindMemberById(teamMembershipId);
        if (tryFindTeamMemberResult.isErr()) {
            return err(tryFindTeamMemberResult.error);
        }

        const teamMembership = tryFindTeamMemberResult.value;

        // Does membership player match operation player
        if (!teamMembership.playerId.equals(player.id)) {
            return err(`TeamMemberships's playerId (${teamMembership.playerId}) does not match Player's id (${player.id}).`);
        }

        const canVerifyIntegrityResult = this.tryVerifyMemberIntegrity(teamMembership, player, { activeFrom: props.activeFrom, activeTo: props.activeTo });
        if (canVerifyIntegrityResult.isErr()) {
            return err(canVerifyIntegrityResult.error);
        }

        return ok(true);
    }

    public executeUpdateMember(teamMembershipId: TeamMembershipId, player: Player, props: { activeFrom: Date; activeTo: Date | null }): void {
        const canUpdateTeamMembershipResult = this.canUpdateMember(teamMembershipId, player, props);
        if (canUpdateTeamMembershipResult.isErr()) {
            throw new Error(canUpdateTeamMembershipResult.error);
        }

        const teamMembership = this.executeFindMemberById(teamMembershipId);
        teamMembership.teamMembershipDates = TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });
        this.domainEvents.push(new TeamMembershipPendingUpdatingEvent(teamMembership));
    }

    public canDeleteTeamMembership(teamMembershipId: TeamMembershipId): Result<true, string> {
        const tryFindTeamMemberResult = this.tryFindMemberById(teamMembershipId);
        if (tryFindTeamMemberResult.isErr()) {
            return err(tryFindTeamMemberResult.error);
        }

        const teamMembership = tryFindTeamMemberResult.value;
        if (teamMembership.teamMembershipHistories.length) {
            return err("Cannot delete TeamMembership while it has TeamMembershipHistories asscociated with it. Make sure to delete them first.");
        }

        return ok(true);
    }

    public executeDeleteTeamMembership(teamMembershipId: TeamMembershipId) {
        const canDeleteTeamMembershipResult = this.canDeleteTeamMembership(teamMembershipId);
        if (canDeleteTeamMembershipResult.isErr()) {
            throw new Error(canDeleteTeamMembershipResult.error);
        }

        const deletedTeamMembership = this.executeFindMemberById(teamMembershipId);
        this.teamMemberships = this.teamMemberships.filter((teamMembership) => teamMembership !== deletedTeamMembership);
        this.domainEvents.push(new TeamMembershipPendingDeletionEvent(deletedTeamMembership));
    }

    public canAddHistoryToTeamMembership(teamMembershipId: TeamMembershipId, props: { id: string; number: number; position: string; dateEffectiveFrom: Date }): Result<TeamMembership, string> {
        const findTeamMembershipResult = this.tryFindMemberById(teamMembershipId);
        if (findTeamMembershipResult.isErr()) {
            return err(findTeamMembershipResult.error);
        }

        const teamMembership = findTeamMembershipResult.value;
        const canAddHistoryResult = teamMembership.canAddHistory(props);
        if (canAddHistoryResult.isErr()) {
            return err(canAddHistoryResult.error);
        }

        return ok(teamMembership);
    }

    public executeAddHistoryToTeamMembership(teamMembershipId: TeamMembershipId, props: { id: string; number: number; position: string; dateEffectiveFrom: Date }): TeamMembershipHistoryId {
        const canAddHistoryToTeamMembershipResult = this.canAddHistoryToTeamMembership(teamMembershipId, props);
        if (canAddHistoryToTeamMembershipResult.isErr()) {
            throw new Error(canAddHistoryToTeamMembershipResult.error);
        }

        const teamMembership = canAddHistoryToTeamMembershipResult.value;
        const teamMembershipHistoryId = teamMembership.executeAddHistory(props);
        this.domainEvents.push(...teamMembership.pullDomainEvent());
        return teamMembershipHistoryId;
    }

    public canUpdateTeamMembershipHistory(
        teamMembershipId: TeamMembershipId,
        teamMembershipHistoryId: TeamMembershipHistoryId,
        props: { number: number; position: string; dateEffectiveFrom: Date },
    ): Result<TeamMembership, string> {
        const findTeamMembershipResult = this.tryFindMemberById(teamMembershipId);
        if (findTeamMembershipResult.isErr()) {
            return err(findTeamMembershipResult.error);
        }

        const teamMembership = findTeamMembershipResult.value;
        const canUpdateHistoryResult = teamMembership.canUpdateHistory(teamMembershipHistoryId, props);
        if (canUpdateHistoryResult.isErr()) {
            return err(canUpdateHistoryResult.error);
        }

        return ok(teamMembership);
    }

    public executeUpdateTeamMembershipHistory(
        teamMembershipId: TeamMembershipId,
        teamMembershipHistoryId: TeamMembershipHistoryId,
        props: { number: number; position: string; dateEffectiveFrom: Date },
    ): void {
        const canUpdateTeamMembershipHistoryResult = this.canUpdateTeamMembershipHistory(teamMembershipId, teamMembershipHistoryId, props);
        if (canUpdateTeamMembershipHistoryResult.isErr()) {
            new Error(canUpdateTeamMembershipHistoryResult.error);
        }

        const teamMembership = this.executeFindMemberById(teamMembershipId);
        teamMembership.executeUpdateHistory(teamMembershipHistoryId, props);
        this.domainEvents.push(...teamMembership.pullDomainEvent());
    }
}

export default Team;

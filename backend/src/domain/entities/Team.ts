import { err, ok, Result } from "neverthrow";
import TeamMembership from "./TeamMembership";
import TeamMembershipFactory from "domain/domainFactories/TeamMembershipFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipPendingCreationEvent";
import Player from "./Player";
import TeamMembershipPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipPendingDeletionEvent";
import TeamMembershipPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipPendingUpdatingEvent";
import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamId";

class Team {
    private readonly __type: "TEAM_DOMAIN" = null!;
    domainEvents: DomainEvent[] = [];
    clearEvents = () => {
        this.domainEvents = [];
    };

    constructor({ id, name, dateFounded, teamMemberships }: { id: string; name: string; dateFounded: Date; teamMemberships: TeamMembership[] }) {
        this.id = id;
        this.name = name;
        this.dateFounded = dateFounded;
        this.teamMemberships = teamMemberships;
    }

    public id: string;
    public name: string;
    public dateFounded: Date;
    public teamMemberships: TeamMembership[];

    private findMemberByPlayerId(playerId: string) {
        return this.teamMemberships.find((membership) => membership.playerId === playerId);
    }

    public filterMembersByPlayerId(playerId: string) {
        return this.teamMemberships.filter((membership) => membership.playerId === playerId);
    }

    private findMemberById(teamMembershipId: string) {
        return this.teamMemberships.find((membership) => membership.id === teamMembershipId);
    }

    public tryFindMemberById(teamMembershipId: TeamMembershipId): Result<TeamMembership, string> {
        const teamMembership = this.findMemberById(teamMembershipId.value);
        if (teamMembership == null) {
            return err(`Team Membership of id "${teamMembershipId.value} does not exist on Team of id ${this.id}"`);
        }

        return ok(teamMembership);
    }

    public findActiveMemberByPlayerId(playerId: string) {
        const membership = this.findMemberByPlayerId(playerId);
        if (membership == null) {
            return null;
        }

        if (membership.isActive()) {
            return membership;
        }

        return null;
    }

    public canAddMember(props: { player: Player; activeFrom: Date; activeTo: Date | null }): Result<boolean, string> {
        const membership = this.findMemberByPlayerId(props.player.id);
        if (membership != null) {
            return err("Player is already a member of the team");
        }

        if (props.activeFrom < this.dateFounded) {
            return err("Team Member's activeFrom cannot be before the team's dateFounded.");
        }

        if (props.player.activeSince > props.activeFrom) {
            return err("Team Member's activeFrom cannot be before the player's activeFrom.");
        }

        const canCreateMembershipDatesResult = TeamMembershipDates.canCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });
        if (canCreateMembershipDatesResult.isErr()) {
            return err(canCreateMembershipDatesResult.error);
        }

        return ok(true);
    }

    public executeAddMember(props: { player: Player; activeFrom: Date; activeTo: Date | null }): TeamMembership["id"] {
        const canAddMemberResult = this.canAddMember(props);
        if (canAddMemberResult.isErr()) {
            throw new Error(canAddMemberResult.error);
        }

        const teamMembership = TeamMembershipFactory.CreateNew({
            id: crypto.randomUUID(),
            teamId: this.id,
            playerId: props.player.id,
            teamMembershipDates: TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo }),
        });

        this.teamMemberships.push(teamMembership);
        this.domainEvents.push(new TeamMembershipPendingCreationEvent(teamMembership));
        return teamMembership.id;
    }

    public canUpdateMember(teamMembershipId: TeamMembershipId, player: Player, props: { activeFrom: Date; activeTo: Date | null }): Result<true, string> {
        const tryFindTeamMemberResult = this.tryFindMemberById(teamMembershipId);
        if (tryFindTeamMemberResult.isErr()) {
            return err(tryFindTeamMemberResult.error);
        }

        if (props.activeFrom < this.dateFounded) {
            return err("TeamMember's activeFrom cannot be before the Team's dateFounded.");
        }

        if (player.activeSince > props.activeFrom) {
            return err("TeamMember's activeFrom cannot be before the Player's activeFrom.");
        }

        return ok(true);
    }

    public executeUpdateMember(player: Player, props: { activeFrom: Date; activeTo: Date | null }): void {
        const canUpdateTeamMembershipResult = this.canUpdateMember(player, props);
        if (canUpdateTeamMembershipResult.isErr()) {
            throw new Error(canUpdateTeamMembershipResult.error);
        }

        const teamMembership = canUpdateTeamMembershipResult.value;
        teamMembership.teamMembershipDates = TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });
        this.domainEvents.push(new TeamMembershipPendingUpdatingEvent(teamMembership));
    }

    public canRemoveTeamMembershipByPlayerId(playerId: Player["id"]): Result<TeamMembership, string> {
        const teamMembership = this.findMemberByPlayerId(playerId);
        if (teamMembership == null) {
            return err(`Player of id "${playerId}" is not a member of the team.`);
        }

        return ok(teamMembership);
    }

    public executeDeleteTeamMembershipByPlayerId(playerId: Player["id"]): void {
        const canRemoveTeamMembershipByPlayerIdResult = this.canRemoveTeamMembershipByPlayerId(playerId);
        if (canRemoveTeamMembershipByPlayerIdResult.isErr()) {
            throw new Error(canRemoveTeamMembershipByPlayerIdResult.error);
        }

        const removedMembership = canRemoveTeamMembershipByPlayerIdResult.value;
        this.teamMemberships = this.teamMemberships.filter((teamMembership) => teamMembership !== removedMembership);
        this.domainEvents.push(new TeamMembershipPendingDeletionEvent(removedMembership));
    }

    public canAddHistoryToTeamMembership(teamMembershipId: TeamMembership["id"], props: { number: number; position: string; dateEffectiveFrom: Date }): Result<TeamMembership, string> {
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

    public executeAddHistoryToTeamMembership(teamMembershipId: TeamMembership["id"], props: { number: number; position: string; dateEffectiveFrom: Date }) {
        const canAddHistoryToTeamMembershipResult = this.canAddHistoryToTeamMembership(teamMembershipId, props);
        if (canAddHistoryToTeamMembershipResult.isErr()) {
            throw new Error(canAddHistoryToTeamMembershipResult.error);
        }

        const teamMembership = canAddHistoryToTeamMembershipResult.value;
        teamMembership.executeAddHistory(props);
    }
}

export default Team;

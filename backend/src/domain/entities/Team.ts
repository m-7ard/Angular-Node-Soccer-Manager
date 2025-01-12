import { err, ok, Result } from "neverthrow";
import TeamMembership from "./TeamMembership";
import TeamMembershipFactory from "domain/domainFactories/TeamMembershipFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipPendingCreationEvent";
import Player from "./Player";
import TeamMembershipPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipPendingDeletionEvent";
import TeamMembershipPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipPendingUpdatingEvent";
import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";

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

    public findMemberByPlayerId(playerId: string) {
        return this.teamMemberships.find((membership) => membership.playerId === playerId);
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

    public canAddMember(props: { player: Player; activeFrom: Date; activeTo: Date | null; number: number }): Result<boolean, string> {
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

    public executeAddMember(props: { player: Player; activeFrom: Date; activeTo: Date | null; number: number }): TeamMembership {
        const canAddMemberResult = this.canAddMember(props);
        if (canAddMemberResult.isErr()) {
            throw new Error(canAddMemberResult.error);
        }

        const teamMembership = TeamMembershipFactory.CreateNew({
            id: crypto.randomUUID(),
            teamId: this.id,
            playerId: props.player.id,
            teamMembershipDates: TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo }),
            number: props.number,
        });
        this.teamMemberships.push(teamMembership);
        this.domainEvents.push(new TeamMembershipPendingCreationEvent(teamMembership));
        return teamMembership;
    }

    public canUpdateMember(player: Player, props: { activeFrom: Date; activeTo: Date | null; number: number }): Result<TeamMembership, string> {
        const teamMembership = this.findMemberByPlayerId(player.id);
        if (teamMembership == null) {
            return err(`Player of id "${player.id}" is not a member of the team.`);
        }

        if (props.activeFrom < this.dateFounded) {
            return err("Team Member's activeFrom cannot be before the team's dateFounded.");
        }

        if (player.activeSince > props.activeFrom) {
            return err("Team Member's activeFrom cannot be before the player's activeFrom.");
        }

        return ok(teamMembership);
    }

    public executeUpdateMember(player: Player, props: { activeFrom: Date; activeTo: Date | null; number: number }): Result<true, string> {
        const canUpdateTeamMembershipResult = this.canUpdateMember(player, props);
        if (canUpdateTeamMembershipResult.isErr()) {
            throw new Error(canUpdateTeamMembershipResult.error);
        }

        const teamMembership = canUpdateTeamMembershipResult.value;
        teamMembership.teamMembershipDates = TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });
        teamMembership.number = props.number;
        this.domainEvents.push(new TeamMembershipPendingUpdatingEvent(teamMembership));
        return ok(true);
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
}

export default Team;

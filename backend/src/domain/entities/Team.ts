import { Err, err, ok, Result } from "neverthrow";
import TeamMembership from "./TeamMembership";
import TeamMembershipFactory from "domain/domainFactories/TeamMembershipFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipPendingCreationEvent";
import Player from "./Player";
import TeamMembershipPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipPendingDeletionEvent";
import TeamMembershipPendingUpdatingEvent from "domain/domainEvents/Team/TeamMembershipPendingUpdatingEvent";

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

    public canAddMember(props: { playerId: string; activeFrom: Date; activeTo: Date | null; number: number }): Result<boolean, string> {
        const membership = this.findMemberByPlayerId(props.playerId);
        if (membership != null) {
            return err("Player is already a member of the team");
        }

        return ok(true);
    }

    public executeAddMember(props: { playerId: string; activeFrom: Date; activeTo: Date | null; number: number }): TeamMembership {
        const canAddMemberResult = this.canAddMember(props);
        if (canAddMemberResult.isErr()) {
            throw new Error(canAddMemberResult.error);
        }
        
        const teamMembership = TeamMembershipFactory.CreateNew({
            id: crypto.randomUUID(),
            teamId: this.id,
            playerId: props.playerId,
            activeFrom: props.activeFrom,
            activeTo: props.activeTo,
            number: props.number,
        });
        this.teamMemberships.push(teamMembership);
        this.domainEvents.push(new TeamMembershipPendingCreationEvent(teamMembership));
        return teamMembership;
    }

    public canUpdateMember(playerId: string, props: { activeFrom: Date; activeTo: Date | null; number: number }): Result<TeamMembership, string> {
        const teamMembership = this.findMemberByPlayerId(playerId);
        if (teamMembership == null) {
            return err(`Player of id "${playerId}" is not a member of the team.`);
        }

        return ok(teamMembership);
    }

    public executeUpdateMember(playerId: string, props: { activeFrom: Date; activeTo: Date | null; number: number }): Result<true, string> {
        const canUpdateTeamMembershipResult = this.canUpdateMember(playerId, props);
        if (canUpdateTeamMembershipResult.isErr()) {
            throw new Error(canUpdateTeamMembershipResult.error);
        }

        const teamMembership = canUpdateTeamMembershipResult.value;
        teamMembership.activeFrom = props.activeFrom;
        teamMembership.activeTo = props.activeTo;
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
            throw new Error(canRemoveTeamMembershipByPlayerIdResult.error)
        }

        const removedMembership = canRemoveTeamMembershipByPlayerIdResult.value;
        this.teamMemberships = this.teamMemberships.filter((teamMembership) => teamMembership !== removedMembership);
        this.domainEvents.push(new TeamMembershipPendingDeletionEvent(removedMembership));
    }
}

export default Team;

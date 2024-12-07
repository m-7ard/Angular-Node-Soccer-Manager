import { err, ok, Result } from "neverthrow";
import TeamMembership from "./TeamMembership";
import TeamMembershipFactory from "domain/domainFactories/TeamMembershipFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipPendingCreationEvent from "domain/domainEvents/Team/TeamMembershipPendingCreationEvent";
import Player from "./Player";
import TeamMembershipPendingDeletionEvent from "domain/domainEvents/Team/TeamMembershipPendingDeletionEvent";

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

    public tryAddMember(props: { playerId: string; activeFrom: Date; activeTo: Date | null; number: number }): Result<TeamMembership, IDomainError> {
        if (this.teamMemberships.find((membership) => membership.playerId === props.playerId) != null) {
            return err({
                code: "PLAYER_ALREADY_IS_MEMBER",
                message: "Player is already a member of the team",
                path: ["playerId"],
            });
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

        return ok(teamMembership);
    }

    public tryRemoveMemberByPlayerId(playerId: Player["id"]): Result<true, IDomainError> {
        const membership = this.teamMemberships.find((membership) => membership.playerId === playerId);
        if (membership == null) {
            return err({
                code: "PLAYER_IS_NOT_MEMBER",
                message: `Player of id "${playerId}" is not a member of the team.`,
                path: ["_"],
            });
        }

        this.domainEvents.push(new TeamMembershipPendingDeletionEvent(membership));
        return ok(true);
    }
}

export default Team;

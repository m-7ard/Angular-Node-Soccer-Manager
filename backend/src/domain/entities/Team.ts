import { err, ok, Result } from "neverthrow";
import TeamMembership from "./TeamMembership";
import TeamMembershipFactory from "domain/domainFactories/TeamMembershipFactory";
import DomainEvent from "domain/domainEvents/DomainEvent";
import TeamMembershipCreatedEvent from "domain/domainEvents/Team/TeamMembershipCreatedEvent";

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
        this.domainEvents.push(new TeamMembershipCreatedEvent(teamMembership));

        return ok(teamMembership);
    }
}

export default Team;

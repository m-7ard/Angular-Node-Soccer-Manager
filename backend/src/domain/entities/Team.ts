import { err, ok, Result } from "neverthrow";
import TeamMembership from "./TeamMembership";
import TeamMembershipFactory from "domain/domainFactories/TeamMembershipFactory";

class Team {
    private readonly __type: "TEAM_DOMAIN" = null!;

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

    public tryAddMember(props: { playerId: string; activeFrom: Date; activeTo: Date | null }): Result<void, IDomainError> {
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
        });
        this.teamMemberships.push(teamMembership);

        return ok(undefined);
    }
}

export default Team;

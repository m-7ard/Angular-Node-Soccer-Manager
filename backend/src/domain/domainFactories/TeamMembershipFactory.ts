import TeamMembership from "../entities/TeamMembership";

class TeamMembershipFactory {
    static CreateNew(props: { id: string; teamId: string; playerId: string; activeFrom: Date; activeTo: Date | null; number: number }) {
        return new TeamMembership({
            id: props.id,
            teamId: props.teamId,
            playerId: props.playerId,
            activeFrom: props.activeFrom,
            activeTo: props.activeTo,
            number: props.number,
        });
    }

    static CreateExisting(props: { id: string; teamId: string; playerId: string; activeFrom: Date; activeTo: Date | null; number: number }) {
        return new TeamMembership({
            id: props.id,
            teamId: props.teamId,
            playerId: props.playerId,
            activeFrom: props.activeFrom,
            activeTo: props.activeTo,
            number: props.number,
        });
    }
}

export default TeamMembershipFactory;

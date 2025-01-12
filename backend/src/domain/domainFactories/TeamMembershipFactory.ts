import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembership from "../entities/TeamMembership";

class TeamMembershipFactory {
    static CreateNew(props: { id: string; teamId: string; playerId: string; teamMembershipDates: TeamMembershipDates; number: number }) {
        return new TeamMembership({
            id: props.id,
            teamId: props.teamId,
            playerId: props.playerId,
            teamMembershipDates: props.teamMembershipDates,
            number: props.number,
        });
    }

    static CreateExisting(props: { id: string; teamId: string; playerId: string; teamMembershipDates: TeamMembershipDates; number: number }) {
        return new TeamMembership({
            id: props.id,
            teamId: props.teamId,
            playerId: props.playerId,
            teamMembershipDates: props.teamMembershipDates,
            number: props.number,
        });
    }
}

export default TeamMembershipFactory;

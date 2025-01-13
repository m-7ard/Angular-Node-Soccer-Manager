import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembership from "../entities/TeamMembership";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";

class TeamMembershipFactory {
    static CreateNew(props: { id: string; teamId: string; playerId: string; teamMembershipDates: TeamMembershipDates; }) {
        return new TeamMembership({
            id: props.id,
            teamId: props.teamId,
            playerId: props.playerId,
            teamMembershipDates: props.teamMembershipDates,
            teamMembershipHistories: []
        });
    }

    static CreateExisting(props: { id: string; teamId: string; playerId: string; teamMembershipDates: TeamMembershipDates; teamMembershipHistories: TeamMembershipHistory[] }) {
        return new TeamMembership({
            id: props.id,
            teamId: props.teamId,
            playerId: props.playerId,
            teamMembershipDates: props.teamMembershipDates,
            teamMembershipHistories: props.teamMembershipHistories
        });
    }
}

export default TeamMembershipFactory;

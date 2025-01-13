import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembership from "../entities/TeamMembership";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamId from "domain/valueObjects/Team/TeamId";
import PlayerId from "domain/valueObjects/Player/PlayerId";

class TeamMembershipFactory {
    static CreateNew(props: { id: TeamMembershipId; teamId: TeamId; playerId: PlayerId; teamMembershipDates: TeamMembershipDates; }) {
        return new TeamMembership({
            id: props.id,
            teamId: props.teamId,
            playerId: props.playerId,
            teamMembershipDates: props.teamMembershipDates,
            teamMembershipHistories: []
        });
    }

    static CreateExisting(props: { id: TeamMembershipId; teamId: TeamId; playerId: PlayerId; teamMembershipDates: TeamMembershipDates; teamMembershipHistories: TeamMembershipHistory[] }) {
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

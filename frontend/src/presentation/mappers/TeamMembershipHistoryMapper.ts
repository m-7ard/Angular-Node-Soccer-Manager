import ITeamMembershipHistoryApiModel from "@apiModels/ITeamMembershipHistoryApiModel";
import TeamMembershipHistory from "../models/TeamMembershipHistory";

class TeamMembershipHistoryMapper {
    static apiModelToDomain(source: ITeamMembershipHistoryApiModel) {
        return new TeamMembershipHistory({
            id: source.id,
            teamMembershipId: source.teamMembershipId,
            dateEffectiveFrom: source.dateEffectiveFrom,
            number: source.number,
            position: source.position,
        });
    }
}

export default TeamMembershipHistoryMapper;

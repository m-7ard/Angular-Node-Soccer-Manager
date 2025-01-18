import ITeamMembershipHistoryApiModel from "@apiModels/ITeamMembershipHistoryApiModel";
import TeamMembershipHistory from "../models/TeamMembershipHistory";
import PlayerPosition from "../app/values/PlayerPosition";

class TeamMembershipHistoryMapper {
    static apiModelToDomain(source: ITeamMembershipHistoryApiModel) {
        return new TeamMembershipHistory({
            id: source.id,
            teamMembershipId: source.teamMembershipId,
            dateEffectiveFrom: source.dateEffectiveFrom,
            number: source.number,
            position: PlayerPosition.executeCreate(source.position),
        });
    }
}

export default TeamMembershipHistoryMapper;

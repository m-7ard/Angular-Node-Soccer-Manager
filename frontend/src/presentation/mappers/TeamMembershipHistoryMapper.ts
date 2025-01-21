import ITeamMembershipHistoryApiModel from "@apiModels/ITeamMembershipHistoryApiModel";
import TeamMembershipHistory from "../models/TeamMembershipHistory";
import PlayerPosition from "../values/PlayerPosition";

class TeamMembershipHistoryMapper {
    static apiModelToDomain(source: ITeamMembershipHistoryApiModel) {
        return new TeamMembershipHistory({
            id: source.id,
            teamMembershipId: source.teamMembershipId,
            dateEffectiveFrom: new Date(source.dateEffectiveFrom),
            number: source.number,
            position: PlayerPosition.executeCreate(source.position),
        });
    }
}

export default TeamMembershipHistoryMapper;

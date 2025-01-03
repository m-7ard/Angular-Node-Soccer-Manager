import ITeamMembershipApiModel from '../apiModels/ITeamMembershipApiModel';
import TeamMembership from '../models/TeamMembership';

class TeamMembershipMapper {
    static apiModelToDomain(source: ITeamMembershipApiModel) {
        return new TeamMembership({
            id: source.id,
            teamId: source.teamId,
            playerId: source.playerId,
            activeFrom: new Date(source.activeFrom),
            activeTo: source.activeTo == null ? null : new Date(source.activeTo),
            number: source.number
        });
    }
}

export default TeamMembershipMapper;

import ITeamPlayerApiModel from '@apiModels/ITeamPlayerApiModel';
import TeamPlayer from '../models/TeamPlayer';
import TeamMembershipMapper from './MembershipMapper';
import PlayerMapper from './PlayerMapper';

class TeamPlayerMapper {
    static apiModelToDomain(source: ITeamPlayerApiModel) {
        return new TeamPlayer({
            player: PlayerMapper.apiModelToDomain(source.player),
            membership: TeamMembershipMapper.apiModelToDomain(source.membership),
        });
    }
}

export default TeamPlayerMapper;

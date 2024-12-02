import ITeamApiModel from '../apiModels/ITeamApiModel';
import Team from '../models/Team';

class TeamMapper {
    static apiModelToDomain(source: ITeamApiModel) {
        return new Team({
            id: source.id,
            name: source.name,
            dateFounded: new Date(source.dateFounded),
        });
    }
}

export default TeamMapper;

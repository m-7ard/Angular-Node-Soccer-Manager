import IMatchApiModel from '@apiModels/IMatchApiModel';
import Match from '../models/Match';
import TeamMapper from './TeamMapper';

class MatchMapper {
    static apiModelToDomain(source: IMatchApiModel) {
        return new Match({
            id: source.id,
            homeTeam: TeamMapper.apiModelToDomain(source.homeTeam),
            awayTeam: TeamMapper.apiModelToDomain(source.awayTeam),
            venue: source.venue,
            scheduledDate: source.scheduledDate,
            startDate: source.startDate,
            endDate: source.endDate,
            status: source.status,
            score: source.score,
        });
    }
}

export default MatchMapper;

import Match from "domain/entities/Match";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import MatchDbEntity from "infrastructure/dbEntities/MatchDbEntity";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import MatchEventMapper from "./MatchEventMapper";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import MatchDomainService from "domain/domainService/MatchDomainService";

class MatchMapper {
    static schemaToDbEntity(source: IMatchSchema): MatchDbEntity {
        return new MatchDbEntity({
            id: source.id,
            home_team_id: source.home_team_id,
            away_team_id: source.away_team_id,
            venue: source.venue,
            scheduled_date: source.scheduled_date,
            start_date: source.start_date,
            end_date: source.end_date,
            status: source.status,
            home_team_score: source.home_team_score,
            away_team_score: source.away_team_score,
            created_at: source.created_at,
            updated_at: source.updated_at,
        });
    }

    static domainToDbEntity(source: Match): MatchDbEntity {
        return new MatchDbEntity({
            id: source.id,
            home_team_id: source.homeTeamId,
            away_team_id: source.awayTeamId,
            venue: source.venue,
            scheduled_date: source.scheduledDate,
            start_date: source.startDate,
            end_date: source.endDate ?? null,
            status: source.status.value,
            away_team_score: source.score?.awayTeamScore ?? null,
            home_team_score: source.score?.homeTeamScore ?? null,
            created_at: source.createdAt,
            updated_at: source.updatedAt,
        });
    }

    static dbEntityToDomain(source: MatchDbEntity): Match {
        const statusResult = MatchStatus.tryCreate(source.status);
        
        if (statusResult.isErr()) {
            throw new Error(statusResult.error)
        }

        const match = new Match({
            id: source.id,
            homeTeamId: source.home_team_id,
            awayTeamId: source.away_team_id,
            venue: source.venue,
            scheduledDate: source.scheduled_date,
            startDate: source.start_date,
            endDate: source.end_date,
            status: statusResult.value,
            score: MatchValueObjectsMapper.dbToValueObject({
                awayTeamScore: source.away_team_score,
                homeTeamScore: source.home_team_score
            }),
            createdAt: source.created_at,
            updatedAt: source.updated_at,
            events: source.events.map(MatchEventMapper.dbEntityToDomain)
        });

        const matchIntegrityResult = MatchDomainService.tryVerifyIntegrity(match);
        if (matchIntegrityResult.isErr()) {
            throw new Error(`Integrity error occured while trying to map Match Db entity to a domain entity: ${JSON.stringify(matchIntegrityResult.error)}`);
        }

        return match;
    }
}

class MatchValueObjectsMapper {
    static dbToValueObject(value: { homeTeamScore: number | null; awayTeamScore: number | null }): MatchScore | null {
        // No scores set
        if (value.awayTeamScore == null && value.homeTeamScore == null) {
            return null;
        }
    
        // Inconsistent score data
        if (value.awayTeamScore == null || value.homeTeamScore == null) {
            throw new Error("Partial score values found in the database.");
        }

        const scoreResult = MatchScore.tryCreate({
            homeTeamScore: value.homeTeamScore,
            awayTeamScore: value.awayTeamScore,
        });
    
        if (scoreResult.isErr()) {
            throw new Error(`Invalid score data: ${JSON.stringify(scoreResult.error)}`);
        }
    
        return scoreResult.value;
    }
}

export default MatchMapper;

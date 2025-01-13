import Team from "domain/entities/Team";
import TeamDbEntity from "infrastructure/dbEntities/TeamDbEntity";
import TeamMembershipMapper from "./TeamMembershipMapper";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import TeamId from "domain/valueObjects/Team/TeamId";

class TeamMapper {
    static schemaToDbEntity(source: ITeamSchema): TeamDbEntity {
        return new TeamDbEntity({
            id: source.id,
            name: source.name,
            date_founded: source.date_founded
        });
    }

    static domainToDbEntity(source: Team): TeamDbEntity {
        return new TeamDbEntity({
            id: source.id.value,
            name: source.name,
            date_founded: source.dateFounded,
        });
    }

    static dbEntityToDomain(source: TeamDbEntity): Team {
        return new Team({
            id: TeamId.executeCreate(source.id),
            name: source.name,
            dateFounded: source.date_founded,
            teamMemberships: source.team_memberships.map(TeamMembershipMapper.dbEntityToDomain),
        });
    }
}

export default TeamMapper;

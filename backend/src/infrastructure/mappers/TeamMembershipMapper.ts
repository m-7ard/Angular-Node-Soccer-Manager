import TeamMembership from "domain/entities/TeamMembership"
import TeamMembershipDbEntity from "infrastructure/dbEntities/TeamMembershipDbEntity";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";

class TeamMembershipMapper {
    static schemaToDbEntity(source: ITeamMembershipSchema): TeamMembershipDbEntity {
        return new TeamMembershipDbEntity({
            active_from: source.active_from,
            active_to: source.active_to,
            id: source.id,
            player_id: source.player_id,
            team_id: source.team_id
        });
    }

    static domainToDbEntity(source: TeamMembership): TeamMembershipDbEntity {
        return new TeamMembershipDbEntity({
            id: source.id,
            team_id: source.teamId,
            player_id: source.playerId,
            active_from: source.activeFrom,
            active_to: source.activeTo,
        })
    }

    static dbEntityToDomain(source: TeamMembershipDbEntity): TeamMembership {
        return new TeamMembership({
            id: source.id,
            teamId: source.team_id,
            playerId: source.player_id,
            activeFrom: source.active_from,
            activeTo: source.active_to,
        })
    }
}

export default TeamMembershipMapper;
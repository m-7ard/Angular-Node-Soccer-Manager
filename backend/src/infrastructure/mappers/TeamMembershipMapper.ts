import TeamMembership from "domain/entities/TeamMembership"
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamMembershipDates from "domain/valueObjects/TeamMembership/TeamMembershipDates";
import TeamMembershipDbEntity from "infrastructure/dbEntities/TeamMembershipDbEntity";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import TeamMembershipHistoryMapper from "./TeamMembershipHistoryMapper";

class TeamMembershipMapper {
    static schemaToDbEntity(source: ITeamMembershipSchema): TeamMembershipDbEntity {
        return new TeamMembershipDbEntity({
            active_from: source.active_from,
            active_to: source.active_to,
            id: source.id,
            player_id: source.player_id,
            team_id: source.team_id,
        });
    }

    static domainToDbEntity(source: TeamMembership): TeamMembershipDbEntity {
        return new TeamMembershipDbEntity({
            id: source.id.value,
            team_id: source.teamId.value,
            player_id: source.playerId.value,
            active_from: source.teamMembershipDates.activeFrom,
            active_to: source.teamMembershipDates.activeTo,
        })
    }

    static dbEntityToDomain(source: TeamMembershipDbEntity): TeamMembership {
        return new TeamMembership({
            id: TeamMembershipId.executeCreate(source.id),
            teamId: TeamId.executeCreate(source.team_id),
            playerId: PlayerId.executeCreate(source.player_id),
            teamMembershipDates: TeamMembershipDates.executeCreate({
                activeFrom: source.active_from,
                activeTo: source.active_to,
            }),
            teamMembershipHistories: source.team_membership_histories.map(TeamMembershipHistoryMapper.dbEntityToDomain)
        })
    }
}

export default TeamMembershipMapper;
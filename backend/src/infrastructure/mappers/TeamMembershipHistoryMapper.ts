import TeamMembershipHistory from "domain/entities/TeamMembershipHistory"
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";
import TeamMembershipHistoryNumber from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryNumber";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import TeamMembershipHistoryDbEntity from "infrastructure/dbEntities/TeamMembershipHistoryDbEntity";
import ITeamMembershipHistorySchema from "infrastructure/dbSchemas/ITeamMembershipHistorySchema";

class TeamMembershipHistoryMapper {
    static schemaToDbEntity(source: ITeamMembershipHistorySchema): TeamMembershipHistoryDbEntity {
        return new TeamMembershipHistoryDbEntity({
            id: source.id,
            team_membership_id: source.team_membership_id,
            date_effective_from: source.date_effective_from,
            number: source.number,
            position: source.position,
        });
    }

    static domainToDbEntity(source: TeamMembershipHistory): TeamMembershipHistoryDbEntity {
        return new TeamMembershipHistoryDbEntity({
            id: source.id.value,
            team_membership_id: source.teamMembershipId.value,
            date_effective_from: source.dateEffectiveFrom,
            number: source.numberValueObject.value,
            position: source.positionValueObject.value,
        })
    }

    static dbEntityToDomain(source: TeamMembershipHistoryDbEntity): TeamMembershipHistory {
        return new TeamMembershipHistory({
            id: TeamMembershipHistoryId.executeCreate(source.id),
            teamMembershipId: TeamMembershipId.executeCreate(source.team_membership_id),
            dateEffectiveFrom: source.date_effective_from,
            numberValueObject: TeamMembershipHistoryNumber.executeCreate(source.number),
            positionValueObject: TeamMembershipHistoryPosition.executeCreate(source.position),
        })
    }
}

export default TeamMembershipHistoryMapper;
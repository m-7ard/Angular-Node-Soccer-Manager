import TeamMembership from "domain/entities/TeamMembership";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";
import TeamMembershipHistoryNumber from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryNumber";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";

class TeamMembershipHistoryFactory {
    static CreateNew(props: { 
        id: TeamMembershipHistoryId;
        teamMembershipId: TeamMembership["id"];
        dateEffectiveFrom: Date;
        numberValueObject: TeamMembershipHistoryNumber;
        positionValueObject: TeamMembershipHistoryPosition;
    }) {
        return new TeamMembershipHistory({
            id: props.id,
            teamMembershipId: props.teamMembershipId,
            dateEffectiveFrom: props.dateEffectiveFrom,
            numberValueObject: props.numberValueObject,
            positionValueObject: props.positionValueObject,
        });
    }

    static CreateExisting(props: { 
        id: TeamMembershipHistoryId;
        teamMembershipId: TeamMembership["id"];
        dateEffectiveFrom: Date;
        numberValueObject: TeamMembershipHistoryNumber;
        positionValueObject: TeamMembershipHistoryPosition;
    }) {
        return new TeamMembershipHistory({
            id: props.id,
            teamMembershipId: props.teamMembershipId,
            dateEffectiveFrom: props.dateEffectiveFrom,
            numberValueObject: props.numberValueObject,
            positionValueObject: props.positionValueObject,
        });
    }
}

export default TeamMembershipHistoryFactory;

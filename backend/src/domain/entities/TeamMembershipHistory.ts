import TeamMembershipHistoryNumber from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryNumber";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";

interface Props {
    id: TeamMembershipHistoryId;
    teamMembershipId: TeamMembershipId;
    dateEffectiveFrom: Date;
    numberValueObject: TeamMembershipHistoryNumber;
    positionValueObject: TeamMembershipHistoryPosition;
}

class TeamMembershipHistory {
    private readonly __type: "TEAM_MEMBERSHIP_HISTORY_DOMAIN" = null!;

    public readonly id: TeamMembershipHistoryId;
    public readonly teamMembershipId: TeamMembershipId;
    public readonly dateEffectiveFrom: Date;
    public readonly numberValueObject: TeamMembershipHistoryNumber;
    public readonly positionValueObject: TeamMembershipHistoryPosition;

    constructor({ id, teamMembershipId, dateEffectiveFrom, numberValueObject, positionValueObject }: Props) {
        this.id = id;
        this.teamMembershipId = teamMembershipId;
        this.dateEffectiveFrom = dateEffectiveFrom;
        this.numberValueObject = numberValueObject;
        this.positionValueObject = positionValueObject;
    }

    public isEffective() {
        const now = new Date();
        return this.dateEffectiveFrom <= now;
    }
}

export default TeamMembershipHistory;

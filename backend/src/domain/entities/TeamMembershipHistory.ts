import TeamMembershipHistoryNumber from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryNumber";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import TeamMembership from "./TeamMembership";
import { err, ok, Result } from "neverthrow";

interface Props {
    id: string;
    teamMembershipId: TeamMembership["id"];
    dateEffectiveFrom: Date;
    numberValueObject: TeamMembershipHistoryNumber;
    positionValueObject: TeamMembershipHistoryPosition;
}

class TeamMembershipHistory {
    private readonly __type: "TEAM_MEMBERSHIP_HISTORY_DOMAIN" = null!;

    public readonly id: string;
    public readonly teamMembershipId: TeamMembership["id"];
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
        return this.dateEffectiveFrom <= new Date();
    }
}

export default TeamMembershipHistory;

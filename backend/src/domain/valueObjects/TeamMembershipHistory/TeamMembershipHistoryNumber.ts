import { err, ok, Result } from "neverthrow";

class TeamMembershipHistoryNumber {
    private readonly __type: "TEAM_MEMBERSHIP_HISTORY_NUMBER" = null!;

    public value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static canCreate(value: number): Result<true, string> {
        if (value < 1 || value > 11) {
            return err("Team Membership History's squad number must be between 1 and 11");
        }

        return ok(true);
    }

    public static executeCreate(value: number): TeamMembershipHistoryNumber {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        const teamMembershipHistoryNumber = new TeamMembershipHistoryNumber(value);
        return teamMembershipHistoryNumber;
    }
}

export default TeamMembershipHistoryNumber;

import { err, ok, Result } from "neverthrow";

class TeamMembershipHistoryId {
    private readonly __type: "TEAM_MEMBERSHIP_HISTORY_ID" = null!;

    public value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static canCreate(value: string): Result<true, string> {
        if (value.length === 0 || value.length >= 255) {
            return err("TeamMembershipHistory id must be between 1 and 255 long");
        } 
        
        return ok(true);
    }

    public static executeCreate(value: string): TeamMembershipHistoryId {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        const matchDates = new TeamMembershipHistoryId(value);
        return matchDates;
    }

    public equals(other: TeamMembershipHistoryId) {
        return other.value === this.value;
    }

    toString() {
        return this.value;
    }
}

export default TeamMembershipHistoryId;

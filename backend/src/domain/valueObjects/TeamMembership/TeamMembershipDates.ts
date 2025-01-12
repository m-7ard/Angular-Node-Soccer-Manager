import { err, ok, Result } from "neverthrow";

class TeamMembershipDates {
    private readonly __type: "TEAM_MEMBERSHIP_DATES" = null!;

    public activeFrom: Date;
    public activeTo: Date | null;

    private constructor(value: { activeFrom: Date; activeTo: Date | null; }) {
        this.activeFrom = value.activeFrom;
        this.activeTo = value.activeTo;
    }

    public static canCreate(value: { activeFrom: Date; activeTo: Date | null; }): Result<true, string> {
        const { activeFrom, activeTo } = value;

        if (activeTo != null && activeTo < activeFrom) {
            return err("Team Membership's active to date cannot be smaller than its active from date.");
        }

        return ok(true);
    }

    public static executeCreate(value: { activeFrom: Date; activeTo: Date | null; }): TeamMembershipDates {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        const matchDates = new TeamMembershipDates(value);
        return matchDates;
    }
}

export default TeamMembershipDates;

import { err, ok, Result } from "neverthrow";
import dateDiff from "utils/dateDifference";

class MatchDates {
    private readonly __type: "MATCH_DATES" = null!;

    public scheduledDate: Date;
    public startDate: Date | null;
    public endDate: Date | null;

    private constructor(value: { scheduledDate: Date; startDate: Date | null; endDate: Date | null }) {
        this.scheduledDate = value.scheduledDate;
        this.startDate = value.startDate;
        this.endDate = value.endDate;
    }

    public static canCreate(value: { scheduledDate: Date; startDate: Date | null; endDate: Date | null }): Result<true, string> {
        const { scheduledDate, startDate, endDate } = value;

        if (startDate != null && startDate < scheduledDate) {
            return err("Start date must be greater than scheduled date.");
        }

        if (endDate != null) {
            if (startDate == null || endDate < startDate) {
                return err("End date must be greater than start date.");
            }
        }

        if (startDate != null && endDate != null && dateDiff(startDate, endDate, "minutes") < 90) {
            return err("Match date's end date must be at least 90 minutes greater than its startDate.");
        }

        return ok(true);
    }

    public static executeCreate(value: { scheduledDate: Date; startDate: Date | null; endDate: Date | null }): MatchDates {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        const matchDates = new MatchDates(value);
        return matchDates;
    }
}

export default MatchDates;

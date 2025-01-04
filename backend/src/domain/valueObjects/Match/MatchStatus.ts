import { err, ok, Result } from "neverthrow";

export default class MatchStatus {
    private readonly __type: "MATCH_STATUS" = null!;

    public static readonly IN_PROGRESS = new MatchStatus("IN_PROGRESS");
    public static readonly SCHEDULED = new MatchStatus("SCHEDULED");
    public static readonly COMPLETED = new MatchStatus("COMPLETED");
    public static readonly CANCELLED = new MatchStatus("CANCELLED");

    private static readonly validStatuses = [MatchStatus.IN_PROGRESS, MatchStatus.SCHEDULED, MatchStatus.COMPLETED, MatchStatus.CANCELLED];

    private constructor(value: string) {
        this.value = value;
    }

    public static tryCreate(value: string): Result<MatchStatus, string> {
        const status = MatchStatus.validStatuses.find((status) => status.value === value);

        if (status == null) {
            return err(`${value} is not a valid MatchStatus`)
        }

        return ok(status);
    }

    public value: string;
}

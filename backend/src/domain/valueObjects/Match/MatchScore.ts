import validateSuperstruct from "api/utils/validateSuperstruct";
import { err, ok, Result } from "neverthrow";
import { is, min, number, object } from "superstruct";

const validator = object({
    homeTeamScore: min(number(), 0),
    awayTeamScore: min(number(), 0),
});

class MatchScore {
    private readonly __type: "MATCH_SCORE" = null!;

    public readonly homeTeamScore: number;
    public readonly awayTeamScore: number;
    public static readonly ZeroScore = new MatchScore({ homeTeamScore: 0, awayTeamScore: 0 });

    private constructor(value: { homeTeamScore: number; awayTeamScore: number }) {
        this.homeTeamScore = value.homeTeamScore;
        this.awayTeamScore = value.awayTeamScore;
    }

    public static canCreate(value: { homeTeamScore: number; awayTeamScore: number }): Result<true, string> {
        const result = validateSuperstruct(validator, value);

        if (result.isErr()) {
            return err(JSON.stringify(result.error.map((failure) => failure.message)));
        }

        return ok(true);
    }

    public static executeCreate(value: { homeTeamScore: number; awayTeamScore: number }) {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error)
        }

        const score = new MatchScore({ homeTeamScore: value.homeTeamScore, awayTeamScore: value.awayTeamScore });
        return score;
    }
}

export default MatchScore;

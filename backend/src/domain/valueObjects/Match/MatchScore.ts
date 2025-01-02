import validateSuperstruct from "api/utils/validateSuperstruct";
import { err, ok } from "neverthrow";
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

    public static tryCreate(value: { homeTeamScore: number; awayTeamScore: number }) {
        const result = validateSuperstruct(validator, value);

        if (result.isErr()) {
            return err(result.error.map((failure) => failure.message));
        }

        return ok(new MatchScore({ homeTeamScore: value.homeTeamScore, awayTeamScore: value.awayTeamScore }));
    }
}

export default MatchScore;

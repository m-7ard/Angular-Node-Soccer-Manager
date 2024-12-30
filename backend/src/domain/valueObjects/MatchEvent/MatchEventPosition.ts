import { is, min, number, object } from "superstruct";

const validator = object({
    x: min(number(), 0),
    y: min(number(), 0),
});

class MatchEventPosition {
    private readonly __type: "MATCH_EVENT_POSITION" = null!;

    public readonly x: number;
    public readonly y: number;

    constructor(value: { x: number; y: number }) {
        if (value.x < 0 || value.y < 0) {
            throw new Error("MatchEventPosition values must be non-negative.");
        }

        this.x = value.x;
        this.y = value.y;
    }

    public static createOrNull(value: { x: unknown; y: unknown }) {
        if (is(value, validator)) {
            return new MatchEventPosition(value);
        }

        return null;
    }
}

export default MatchEventPosition;

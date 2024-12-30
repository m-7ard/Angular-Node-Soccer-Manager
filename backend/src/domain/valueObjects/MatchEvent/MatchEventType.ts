export default class MatchEventType {
    private readonly __type: "MATCH_EVENT_TYPE" = null!;

    public static readonly GOAL = new MatchEventType("GOAL");
    public static readonly ASSIST = new MatchEventType("ASSIST");
    public static readonly YELLOW_CARD = new MatchEventType("YELLOW_CARD");
    public static readonly RED_CARD = new MatchEventType("RED_CARD");
    public static readonly SUBSTITUTION = new MatchEventType("SUBSTITUTION");
    public static readonly INJURY = new MatchEventType("INJURY");

    private static readonly validEvents = [MatchEventType.GOAL, MatchEventType.ASSIST, MatchEventType.YELLOW_CARD, MatchEventType.RED_CARD, MatchEventType.SUBSTITUTION, MatchEventType.INJURY];

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): MatchEventType {
        const event = MatchEventType.validEvents.find((e) => e.value === value);

        if (!event) {
            throw new Error(`${value} is not a valid EventType`);
        }

        return event;
    }

    public value: string;
}

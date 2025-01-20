import { err, ok, Result } from "neverthrow";
import convertToTitleCase from "../utils/convertToTitleCase";

export default class PlayerPosition {
    private readonly __type: "TEAM_MEMBERSHIP_HISTORY_POSITION" = null!;

    public static readonly GOALKEEPER = new PlayerPosition("GOALKEEPER");
    public static readonly CENTER_BACK = new PlayerPosition("CENTER_BACK");
    public static readonly FULL_BACK = new PlayerPosition("FULL_BACK");
    public static readonly LEFT_FULL_BACK = new PlayerPosition("LEFT_FULL_BACK");
    public static readonly RIGHT_FULL_BACK = new PlayerPosition("RIGHT_FULL_BACK");
    public static readonly WING_BACK = new PlayerPosition("WING_BACK");
    public static readonly LEFT_WING_BACK = new PlayerPosition("LEFT_WING_BACK");
    public static readonly RIGHT_WING_BACK = new PlayerPosition("RIGHT_WING_BACK");
    public static readonly SWEEPER = new PlayerPosition("SWEEPER");
    public static readonly DEFENSIVE_MIDFIELDER = new PlayerPosition("DEFENSIVE_MIDFIELDER");
    public static readonly CENTRAL_MIDFIELDER = new PlayerPosition("CENTRAL_MIDFIELDER");
    public static readonly ATTACKING_MIDFIELDER = new PlayerPosition("ATTACKING_MIDFIELDER");
    public static readonly WIDE_MIDFIELDER = new PlayerPosition("WIDE_MIDFIELDER");
    public static readonly LEFT_WIDE_MIDFIELDER = new PlayerPosition("LEFT_WIDE_MIDFIELDER");
    public static readonly RIGHT_WIDE_MIDFIELDER = new PlayerPosition("RIGHT_WIDE_MIDFIELDER");
    public static readonly STRIKER = new PlayerPosition("STRIKER");
    public static readonly CENTER_FORWARD = new PlayerPosition("CENTER_FORWARD");
    public static readonly WINGER = new PlayerPosition("WINGER");
    public static readonly LEFT_WINGER = new PlayerPosition("LEFT_WINGER");
    public static readonly RIGHT_WINGER = new PlayerPosition("RIGHT_WINGER");
    public static readonly SECOND_STRIKER = new PlayerPosition("SECOND_STRIKER");

    public static readonly validPositions = [
        PlayerPosition.GOALKEEPER,
        PlayerPosition.CENTER_BACK,
        PlayerPosition.FULL_BACK,
        PlayerPosition.LEFT_FULL_BACK,
        PlayerPosition.RIGHT_FULL_BACK,
        PlayerPosition.WING_BACK,
        PlayerPosition.LEFT_WING_BACK,
        PlayerPosition.RIGHT_WING_BACK,
        PlayerPosition.SWEEPER,
        PlayerPosition.DEFENSIVE_MIDFIELDER,
        PlayerPosition.CENTRAL_MIDFIELDER,
        PlayerPosition.ATTACKING_MIDFIELDER,
        PlayerPosition.WIDE_MIDFIELDER,
        PlayerPosition.LEFT_WIDE_MIDFIELDER,
        PlayerPosition.RIGHT_WIDE_MIDFIELDER,
        PlayerPosition.STRIKER,
        PlayerPosition.CENTER_FORWARD,
        PlayerPosition.WINGER,
        PlayerPosition.LEFT_WINGER,
        PlayerPosition.RIGHT_WINGER,
        PlayerPosition.SECOND_STRIKER,
    ];

    private constructor(value: string) {
        this.value = value;
    }

    public get label() {
        return convertToTitleCase(this.value);
    }

    public static canCreate(value: string): Result<PlayerPosition, string> {
        const status = PlayerPosition.validPositions.find((status) => status.value === value);

        if (status == null) {
            return err(`${value} is not a valid TeamMembershipHistoryPosition`);
        }

        return ok(status);
    }

    public static executeCreate(value: string): PlayerPosition {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        return canCreateResult.value;
    }

    public value: string;
}

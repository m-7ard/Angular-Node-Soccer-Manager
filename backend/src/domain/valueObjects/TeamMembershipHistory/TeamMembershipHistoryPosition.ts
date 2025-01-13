import { err, ok, Result } from "neverthrow";

export default class TeamMembershipHistoryPosition {
    private readonly __type: "TEAM_MEMBERSHIP_HISTORY_POSITION" = null!;

    public static readonly GOALKEEPER = new TeamMembershipHistoryPosition("GOALKEEPER");
    public static readonly CENTER_BACK = new TeamMembershipHistoryPosition("CENTER_BACK");
    public static readonly FULL_BACK = new TeamMembershipHistoryPosition("FULL_BACK");
    public static readonly LEFT_FULL_BACK = new TeamMembershipHistoryPosition("LEFT_FULL_BACK");
    public static readonly RIGHT_FULL_BACK = new TeamMembershipHistoryPosition("RIGHT_FULL_BACK");
    public static readonly WING_BACK = new TeamMembershipHistoryPosition("WING_BACK");
    public static readonly LEFT_WING_BACK = new TeamMembershipHistoryPosition("LEFT_WING_BACK");
    public static readonly RIGHT_WING_BACK = new TeamMembershipHistoryPosition("RIGHT_WING_BACK");
    public static readonly SWEEPER = new TeamMembershipHistoryPosition("SWEEPER");
    public static readonly DEFENSIVE_MIDFIELDER = new TeamMembershipHistoryPosition("DEFENSIVE_MIDFIELDER");
    public static readonly CENTRAL_MIDFIELDER = new TeamMembershipHistoryPosition("CENTRAL_MIDFIELDER");
    public static readonly ATTACKING_MIDFIELDER = new TeamMembershipHistoryPosition("ATTACKING_MIDFIELDER");
    public static readonly WIDE_MIDFIELDER = new TeamMembershipHistoryPosition("WIDE_MIDFIELDER");
    public static readonly LEFT_WIDE_MIDFIELDER = new TeamMembershipHistoryPosition("LEFT_WIDE_MIDFIELDER");
    public static readonly RIGHT_WIDE_MIDFIELDER = new TeamMembershipHistoryPosition("RIGHT_WIDE_MIDFIELDER");
    public static readonly STRIKER = new TeamMembershipHistoryPosition("STRIKER");
    public static readonly CENTER_FORWARD = new TeamMembershipHistoryPosition("CENTER_FORWARD");
    public static readonly WINGER = new TeamMembershipHistoryPosition("WINGER");
    public static readonly LEFT_WINGER = new TeamMembershipHistoryPosition("LEFT_WINGER");
    public static readonly RIGHT_WINGER = new TeamMembershipHistoryPosition("RIGHT_WINGER");
    public static readonly SECOND_STRIKER = new TeamMembershipHistoryPosition("SECOND_STRIKER");

    private static readonly validPositions = [
        TeamMembershipHistoryPosition.GOALKEEPER,
        TeamMembershipHistoryPosition.CENTER_BACK,
        TeamMembershipHistoryPosition.FULL_BACK,
        TeamMembershipHistoryPosition.LEFT_FULL_BACK,
        TeamMembershipHistoryPosition.RIGHT_FULL_BACK,
        TeamMembershipHistoryPosition.WING_BACK,
        TeamMembershipHistoryPosition.LEFT_WING_BACK,
        TeamMembershipHistoryPosition.RIGHT_WING_BACK,
        TeamMembershipHistoryPosition.SWEEPER,
        TeamMembershipHistoryPosition.DEFENSIVE_MIDFIELDER,
        TeamMembershipHistoryPosition.CENTRAL_MIDFIELDER,
        TeamMembershipHistoryPosition.ATTACKING_MIDFIELDER,
        TeamMembershipHistoryPosition.WIDE_MIDFIELDER,
        TeamMembershipHistoryPosition.LEFT_WIDE_MIDFIELDER,
        TeamMembershipHistoryPosition.RIGHT_WIDE_MIDFIELDER,
        TeamMembershipHistoryPosition.STRIKER,
        TeamMembershipHistoryPosition.CENTER_FORWARD,
        TeamMembershipHistoryPosition.WINGER,
        TeamMembershipHistoryPosition.LEFT_WINGER,
        TeamMembershipHistoryPosition.RIGHT_WINGER,
        TeamMembershipHistoryPosition.SECOND_STRIKER,
    ];

    private constructor(value: string) {
        this.value = value;
    }

    public static canCreate(value: string): Result<TeamMembershipHistoryPosition, string> {
        const status = TeamMembershipHistoryPosition.validPositions.find((status) => status.value === value);

        if (status == null) {
            return err(`${value} is not a valid TeamMembershipHistoryPosition`);
        }

        return ok(status);
    }

    public static executeCreate(value: string): TeamMembershipHistoryPosition {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        return canCreateResult.value;
    }

    public value: string;
}

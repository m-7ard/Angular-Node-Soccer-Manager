import { err, ok, Result } from "neverthrow";
import IValueObject from "../IValueObject";

class PlayerId implements IValueObject {
    readonly __type: "PLAYER_ID" = null!;

    public value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static canCreate(value: string): Result<true, string> {
        if (value.length === 0 || value.length >= 255) {
            return err("Team id must be between 1 and 255 long");
        }

        return ok(true);
    }

    public static executeCreate(value: string): PlayerId {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        const matchDates = new PlayerId(value);
        return matchDates;
    }

    public equals(other: unknown) {
        return other instanceof PlayerId ? other.value === this.value : false;
    }

    toString() {
        return this.value;
    }
}

export default PlayerId;

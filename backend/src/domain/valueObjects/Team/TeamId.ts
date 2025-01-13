import { err, ok, Result } from "neverthrow";

class TeamId {
    private readonly __type: "TEAM_ID" = null!;

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

    public static executeCreate(value: string): TeamId {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        const matchDates = new TeamId(value);
        return matchDates;
    }

    public equals(other: TeamId) {
        return other.value === this.value;
    }

    toString() {
        return this.value;
    }
}

export default TeamId;

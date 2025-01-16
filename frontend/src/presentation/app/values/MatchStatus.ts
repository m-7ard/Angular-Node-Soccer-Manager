export default class MatchStatus {
    private static instances: MatchStatus[] = [];
    public cls = MatchStatus;

    private constructor(
        public readonly value: string,
        public readonly label: string,
        public readonly colors: string,
        public readonly isScorable: boolean
    ) {
        MatchStatus.instances.push(this);
    }

    private static createStatus(
        value: string,
        label: string,
        colors: string,
        isScorable: boolean
    ): MatchStatus {
        return new MatchStatus(value, label, colors, isScorable);
    }

    public canTransition(status: MatchStatus) {
        if (this === MatchStatus.SCHEDULED) {
            return [MatchStatus.IN_PROGRESS, MatchStatus.CANCELLED].includes(status);
        } else if (this === MatchStatus.IN_PROGRESS) {
            return [MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(status);
        } else if (this === MatchStatus.COMPLETED) {
            return [MatchStatus.CANCELLED].includes(status);
        }

        return false;
    };

    public static readonly SCHEDULED = MatchStatus.createStatus(
        "SCHEDULED",
        "Scheduled",
        "bg-orange-400 text-white",
        false
    );

    public static readonly IN_PROGRESS = MatchStatus.createStatus(
        "IN_PROGRESS",
        "In Progress",
        "bg-emerald-400 text-white",
        true
    );

    public static readonly COMPLETED = MatchStatus.createStatus(
        "COMPLETED",
        "Completed",
        "bg-blue-400 text-white",
        true
    );

    public static readonly CANCELLED = MatchStatus.createStatus(
        "CANCELLED",
        "Cancelled",
        "bg-gray-200",
        true
    );

    public static executeCreate(value: string) {
        const status = this.instances.find((matchStatus) => matchStatus.value === value);
        
        if (status == null) {
            throw new Error(`MatchStatus of value "${value}" does not exist.`);
        }

        return status;
    }
}

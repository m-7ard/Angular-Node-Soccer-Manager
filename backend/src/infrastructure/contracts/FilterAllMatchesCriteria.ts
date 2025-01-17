type Props = {
    scheduledDate: Date | null;
    limitBy: number | null;
    status: string | null;
    teamId: string | null;
}

export default class FilterAllMatchesCriteria implements Props {
    private readonly __type = "FILTER_ALL_MATCHES_CRITERIA";

    constructor(props: Props) {
        this.scheduledDate = props.scheduledDate;
        this.limitBy = props.limitBy;
        this.status = props.status;
        this.teamId = props.teamId;
    }

    scheduledDate: Date | null;
    limitBy: number | null;
    status: string | null;
    teamId: string | null;
}

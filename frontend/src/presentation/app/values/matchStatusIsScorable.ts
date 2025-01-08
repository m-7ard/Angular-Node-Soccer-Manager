import matchStatuses from "./matchStatuses";

const matchStatusIsScorable: Record<string, boolean> = {
    [matchStatuses.SCHEDULED]: false,
    [matchStatuses.IN_PROGRESS]: true,
    [matchStatuses.COMPLETED]: true,
    [matchStatuses.CANCELLED]: true,
};

export default matchStatusIsScorable;

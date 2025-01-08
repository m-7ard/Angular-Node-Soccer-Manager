import matchStatuses from "./matchStatuses";

const matchStatusTransitions: Record<string, string[]> = {
    [matchStatuses.IN_PROGRESS]: [matchStatuses.COMPLETED, matchStatuses.CANCELLED],
    [matchStatuses.SCHEDULED]: [matchStatuses.IN_PROGRESS, matchStatuses.CANCELLED],
    [matchStatuses.COMPLETED]: [matchStatuses.CANCELLED],
    [matchStatuses.CANCELLED]: [],
};

export default matchStatusTransitions;

import matchStatuses from "./matchStatuses";

const matchStatusLabels: Record<string, string> = {
    [matchStatuses.IN_PROGRESS]: 'In Progress',
    [matchStatuses.SCHEDULED]: 'Scheduled',
    [matchStatuses.COMPLETED]: 'Completed',
    [matchStatuses.CANCELLED]: 'Cancelled',
};

export default matchStatusLabels;

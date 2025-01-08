import matchStatuses from "./matchStatuses";

const matchStatusColors: Record<string, string> = {
    [matchStatuses.SCHEDULED]: 'bg-orange-400 text-white',
    [matchStatuses.IN_PROGRESS]: 'bg-emerald-400 text-white',
    [matchStatuses.COMPLETED]: 'bg-blue-400 text-white',
    [matchStatuses.CANCELLED]: 'bg-gray-200',
};

export default matchStatusColors;

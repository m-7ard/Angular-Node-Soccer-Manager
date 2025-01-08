import matchStatusColors from '../app/values/matchStatusColors';
import matchStatuses from '../app/values/matchStatuses';
import matchStatusIsScorable from '../app/values/matchStatusIsScorable';
import matchStatusLabels from '../app/values/matchStatusLabels';
import matchStatusTransitions from '../app/values/matchStatusTransitions';
import Team from './Team';

type MatchProps = {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    venue: string;
    scheduledDate: string;
    startDate: string | null;
    endDate: string | null;
    status: string;
    score: {
        homeTeamScore: number;
        awayTeamScore: number;
    } | null;
};

class Match implements MatchProps {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    venue: string;
    scheduledDate: string;
    startDate: string | null;
    endDate: string | null;
    status: string;
    score: { homeTeamScore: number; awayTeamScore: number } | null;

    constructor(props: MatchProps) {
        this.id = props.id;
        this.homeTeam = props.homeTeam;
        this.awayTeam = props.awayTeam;
        this.venue = props.venue;
        this.scheduledDate = props.scheduledDate;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.status = props.status;
        this.score = props.score;
    }

    get statusLabel() {
        const label = matchStatusLabels[this.status];
        if (label == null) {
            throw new Error(`Status of Match lacks a label. Status: ${this.status}`);
        }

        return label;
    }

    get statusColor() {
        const color = matchStatusColors[this.status];
        if (color == null) {
            throw new Error(`Status of Match lacks a color. Status: ${this.status}`);
        }

        return color;
    }

    canTransition(status: typeof matchStatuses[keyof typeof matchStatuses]) {
        const transitions = matchStatusTransitions[this.status];
        console.log(transitions)

        if (transitions == null) {
            throw new Error(`Status of Match lacks a transition. Status: ${this.status}`);
        }

        return transitions.includes(status);
    }

    canScore() {
        const canScore = matchStatusIsScorable[this.status];

        console.log(this.status, canScore)

        if (canScore == null) {
            throw new Error(`Status of Match lacks a value in matchStatusIsScorable. Status: ${this.status}`);
        }

        return canScore;
    }

    public VALID_MATCH_STATUSES = matchStatuses;
}

export default Match;

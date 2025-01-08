import matchStatusColors from '../app/values/matchStatusColors';
import matchStatusLabels from '../app/values/matchStatusLabels';
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
}

export default Match;

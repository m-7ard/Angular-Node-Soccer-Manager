import MatchStatus from '../app/values/MatchStatus';
import matchStatuses from '../app/values/matchStatuses';
import Team from './Team';

type MatchProps = {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: MatchStatus;
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
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: MatchStatus;
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
        return this.status.label;
    }

    get statusColor() {
        return this.status.colors;
    }

    canTransition(status: MatchStatus) {
        return this.status.canTransition(status);
    }

    canScore() {
        this.status.isScorable;
    }
}

export default Match;

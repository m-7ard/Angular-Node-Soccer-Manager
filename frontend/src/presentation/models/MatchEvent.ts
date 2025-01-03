import Player from './Player';

type MatchEventProps = {
    id: string;
    matchId: string;
    player: Player;
    teamId: string;
    type: string;
    dateOccurred: string;
    secondaryPlayer: Player | null;
    description: string;
};

class MatchEvent implements MatchEventProps {
    id: string;
    matchId: string;
    player: Player;
    teamId: string;
    type: string;
    dateOccurred: string;
    secondaryPlayer: Player | null;
    description: string;

    constructor(props: MatchEventProps) {
        this.id = props.id;
        this.matchId = props.matchId;
        this.player = props.player;
        this.teamId = props.teamId;
        this.type = props.type;
        this.dateOccurred = props.dateOccurred;
        this.secondaryPlayer = props.secondaryPlayer;
        this.description = props.description;
    }
}

export default MatchEvent;

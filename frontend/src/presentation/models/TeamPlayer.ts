import Player from './Player';
import TeamMembership from './TeamMembership';

class TeamPlayer {
    constructor({ player, membership }: { player: Player; membership: TeamMembership }) {
        this.player = player;
        this.membership = membership;
    }

    public player: Player;
    public membership: TeamMembership;
}

export default TeamPlayer;
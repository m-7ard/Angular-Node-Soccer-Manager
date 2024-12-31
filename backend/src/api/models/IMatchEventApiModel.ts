export default interface IMatchEventApiModel {
    id: string;
    matchId: string;
    playerId: string;
    teamId: string;
    type: string;
    timestamp: string;
    secondaryPlayerId: string | null;
    description: string;
    position: {
        x: number;
        y: number
    } | null;
}

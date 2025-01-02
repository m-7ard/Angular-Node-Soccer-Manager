export default interface IMatchEventApiModel {
    id: string;
    matchId: string;
    playerId: string;
    teamId: string;
    type: string;
    dateOccured: string;
    secondaryPlayerId: string | null;
    description: string;
}

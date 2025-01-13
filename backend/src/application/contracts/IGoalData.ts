import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";

export default interface IGoalData {
    dateOccured: Date;
    teamId: TeamId;
    playerId: PlayerId;
}

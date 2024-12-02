import IPlayerApiModel from "./IPlayerApiModel";
import ITeamMembershipApiModel from "./ITeamMembershipApiModel";

interface ITeamPlayerApiModel {
    player: IPlayerApiModel;
    membership: ITeamMembershipApiModel;
}

export default ITeamPlayerApiModel;

import IPlayerApiModel from "./IPlayerApiModel";

interface ITeamPlayerApiModel {
    player: IPlayerApiModel;
    membership: ITeamMembershipApiModel;
}

export default ITeamPlayerApiModel;

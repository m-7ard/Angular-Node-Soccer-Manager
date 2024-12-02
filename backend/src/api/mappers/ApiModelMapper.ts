import IPlayerApiModel from "api/models/IPlayerApiModel";
import ITeamApiModel from "api/models/ITeamApiModel";
import ITeamMembershipApiModel from "api/models/ITeamMembershipApiModel";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";

class ApiModelMapper {
    public static createTeamApiModel(team: Team): ITeamApiModel {
        return {
            id: team.id,
            name: team.name,
            dateFounded: team.dateFounded.toJSON(),
        };
    }

    public static createPlayerApiModel(player: Player): IPlayerApiModel {
        return {
            id: player.id,
            activeSince: player.activeSince,
            name: player.name,
        };
    }

    public static createTeamMembershipApiModel(membership: TeamMembership): ITeamMembershipApiModel {
        return {
            id: membership.id,
            teamId: membership.teamId,
            playerId: membership.playerId,
            activeFrom: membership.activeFrom,
            activeTo: membership.activeTo,
            number: membership.number
        };
    }
}

export default ApiModelMapper;

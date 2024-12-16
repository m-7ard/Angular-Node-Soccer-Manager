import ITeamApiModel from "@apiModels/ITeamApiModel";
import ITeamPlayerApiModel from "@apiModels/ITeamPlayerApiModel";
import IUserApiModel from "@apiModels/IUserApiModel";
import IPlayerApiModel from "api/models/IPlayerApiModel";
import ITeamMembershipApiModel from "api/models/ITeamMembershipApiModel";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import User from "domain/entities/User";

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
            activeSince: player.activeSince.toJSON(),
            name: player.name,
        };
    }

    public static createTeamMembershipApiModel(membership: TeamMembership): ITeamMembershipApiModel {
        return {
            id: membership.id,
            teamId: membership.teamId,
            playerId: membership.playerId,
            activeFrom: membership.activeFrom.toJSON(),
            activeTo: membership.activeTo == null ? null : membership.activeTo.toJSON(),
            number: membership.number,
        };
    }

    public static createTeamPlayerApiModel(membership: TeamMembership, player: Player): ITeamPlayerApiModel {
        return {
            player: ApiModelMapper.createPlayerApiModel(player),
            membership: ApiModelMapper.createTeamMembershipApiModel(membership),
        };
    }

    public static createUserApiModel(user: User): IUserApiModel {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            dateCreated: user.dateCreated.toString(),
            isAdmin: user.isAdmin,
        };
    }
}

export default ApiModelMapper;

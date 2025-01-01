import IMatchApiModel from "@apiModels/IMatchApiModel";
import IMatchEventApiModel from "@apiModels/IMatchEventApiModel";
import ITeamApiModel from "@apiModels/ITeamApiModel";
import ITeamPlayerApiModel from "@apiModels/ITeamPlayerApiModel";
import IUserApiModel from "@apiModels/IUserApiModel";
import IPlayerApiModel from "api/models/IPlayerApiModel";
import ITeamMembershipApiModel from "api/models/ITeamMembershipApiModel";
import Match from "domain/entities/Match";
import MatchEvent from "domain/entities/MatchEvent";
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

    public static createMatchApiModel(match: Match): IMatchApiModel {
        return {
            id: match.id,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            venue: match.venue,
            scheduledDate: match.scheduledDate.toString(),
            startDate: match.startDate == null ? null : match.startDate.toString(),
            endDate: match.endDate == null ? null : match.endDate.toString(),
            status: match.status.value,
            score:
                match.score == null
                    ? null
                    : {
                          awayTeamScore: match.score.awayTeamScore,
                          homeTeamScore: match.score.homeTeamScore,
                      },
        };
    }

    public static createMatchEventApiModel(match: MatchEvent): IMatchEventApiModel {
        return {
            id: match.id,
            matchId: match.matchId,
            playerId: match.playerId,
            teamId: match.teamId,
            type: match.type.value,
            timestamp: match.timestamp.toString(),
            secondaryPlayerId: match.secondaryPlayerId,
            description: match.description,
            position: match.position,
        };
    }
}

export default ApiModelMapper;

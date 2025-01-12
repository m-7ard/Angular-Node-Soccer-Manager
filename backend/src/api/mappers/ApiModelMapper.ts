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
            activeFrom: membership.teamMembershipDates.activeFrom.toJSON(),
            activeTo: membership.teamMembershipDates.activeTo == null ? null : membership.teamMembershipDates.activeTo.toJSON(),
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

    public static createMatchApiModel(props: { match: Match; homeTeam: Team; awayTeam: Team }): IMatchApiModel {
        const { match, homeTeam, awayTeam } = props;

        return {
            id: match.id,
            homeTeam: this.createTeamApiModel(homeTeam),
            awayTeam: this.createTeamApiModel(awayTeam),
            venue: match.venue,
            scheduledDate: match.matchDates.scheduledDate.toString(),
            startDate: match.matchDates.startDate == null ? null : match.matchDates.startDate.toString(),
            endDate: match.matchDates.endDate == null ? null : match.matchDates.endDate.toString(),
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

    public static createMatchEventApiModel(props: { matchEvent: MatchEvent; player: Player; secondaryPlayer: Player | null }): IMatchEventApiModel {
        const { matchEvent, player, secondaryPlayer } = props;

        return {
            id: matchEvent.id,
            matchId: matchEvent.matchId,
            player: this.createPlayerApiModel(player),
            teamId: matchEvent.teamId,
            type: matchEvent.type.value,
            dateOccured: matchEvent.dateOccured.toString(),
            secondaryPlayer: secondaryPlayer == null ? null : this.createPlayerApiModel(secondaryPlayer),
            description: matchEvent.description,
        };
    }
}

export default ApiModelMapper;

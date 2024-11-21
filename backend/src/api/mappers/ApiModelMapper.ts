import IPlayerApiModel from "api/models/IPlayerApiModel";
import ICompactTeamApiModel from "api/models/ICompactTeamApiModel";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import IFullTeamApiModel from "api/models/IFullTeamApiModel";

class ApiModelMapper {
    public static createCompactTeamApiModel(team: Team): ICompactTeamApiModel {
        return {
            id: team.id,
            name: team.name,
            dateFounded: team.dateFounded.toJSON(),
        };
    }

    public static createFullTeamApiModel(team: Team, players: Player[]): IFullTeamApiModel {
        return {
            id: team.id,
            name: team.name,
            dateFounded: team.dateFounded.toJSON(),
            players: players.map(ApiModelMapper.createPlayerApiModel),
        };
    }

    public static createPlayerApiModel(player: Player): IPlayerApiModel {
        return {
            id: player.id,
            activeSince: player.activeSince,
            name: player.name,
            number: player.number,
        };
    }
}

export default ApiModelMapper;

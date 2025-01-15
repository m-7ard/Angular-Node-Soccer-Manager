import IMatchApiModel from "@apiModels/IMatchApiModel";
import IMatchEventApiModel from "@apiModels/IMatchEventApiModel";
import IMatchParticipantsApiModel from "@apiModels/IMatchParticipantsApiModel";
import ITeamPlayerApiModel from "@apiModels/ITeamPlayerApiModel";
import IApiModelService from "api/interfaces/IApiModelService";
import IDatabaseService from "api/interfaces/IDatabaseService";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import Match from "domain/entities/Match";
import MatchEvent from "domain/entities/MatchEvent";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import PlayerRepository from "infrastructure/repositories/PlayerRepository";
import TeamRepository from "infrastructure/repositories/TeamRepository";

class ApiModelService implements IApiModelService {
    private readonly playerRepository: IPlayerRepository;
    private readonly teamRepository: ITeamRepository;

    private readonly playerCache = new Map<Player["id"], Player | null>();
    private readonly teamCache = new Map<Team["id"], Team | null>();

    constructor(private readonly db: IDatabaseService) {
        this.playerRepository = new PlayerRepository(db);
        this.teamRepository = new TeamRepository(db);
    }

    private async getPlayerFromCacheOrDb(playerId: PlayerId): Promise<Player | null> {
        if (this.playerCache.has(playerId)) {
            return this.playerCache.get(playerId)!;
        }

        const player = await this.playerRepository.getByIdAsync(playerId);
        this.playerCache.set(playerId, player);
        return player;
    }

    private async getTeamFromCacheOrDb(teamId: TeamId): Promise<Team | null> {
        if (this.teamCache.has(teamId)) {
            return this.teamCache.get(teamId)!;
        }

        const team = await this.teamRepository.getByIdAsync(teamId);
        this.teamCache.set(teamId, team);
        return team;
    }

    async createMatchApiModel(match: Match): Promise<IMatchApiModel> {
        const homeTeam = await this.getTeamFromCacheOrDb(match.homeTeamId);
        if (homeTeam == null) throw new Error("Home Team does not exist.");

        const awayTeam = await this.getTeamFromCacheOrDb(match.awayTeamId);
        if (awayTeam == null) throw new Error("Away Team does not exist.");

        return ApiModelMapper.createMatchApiModel({
            match: match,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
        });
    }

    async createManyMatchApiModels(matches: Match[]): Promise<IMatchApiModel[]> {
        const results: IMatchApiModel[] = [];

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            results.push(await this.createMatchApiModel(match));
        }

        return results;
    }

    async createMatchEventApiModel(matchEvent: MatchEvent): Promise<IMatchEventApiModel> {
        const player = await this.getPlayerFromCacheOrDb(matchEvent.playerId);
        if (player == null) throw new Error("Player does not exist.");

        let secondaryPlayer: Player | null = null;
        if (matchEvent.secondaryPlayerId != null) {
            secondaryPlayer = await this.getPlayerFromCacheOrDb(matchEvent.secondaryPlayerId);
            if (secondaryPlayer == null) throw new Error("Secondary player does not exist.");
        }

        return ApiModelMapper.createMatchEventApiModel({
            matchEvent: matchEvent,
            player: player,
            secondaryPlayer: secondaryPlayer,
        });
    }

    async createManyMatchEventApiModel(matchEvents: MatchEvent[]): Promise<IMatchEventApiModel[]> {
        const results: IMatchEventApiModel[] = [];

        for (let i = 0; i < matchEvents.length; i++) {
            const matchEvent = matchEvents[i];
            results.push(await this.createMatchEventApiModel(matchEvent));
        }

        return results;
    }

    async createTeamPlayerApiModel(teamMembership: TeamMembership): Promise<ITeamPlayerApiModel> {
        const player = await this.getPlayerFromCacheOrDb(teamMembership.playerId);
        if (player == null) throw new Error("Player does not exist.");

        return {
            membership: ApiModelMapper.createTeamMembershipApiModel(teamMembership),
            player: ApiModelMapper.createPlayerApiModel(player),
        };
    }

    async createManyTeamPlayerApiModel(teamMemberships: Array<TeamMembership>): Promise<ITeamPlayerApiModel[]> {
        const results: ITeamPlayerApiModel[] = [];

        for (let i = 0; i < teamMemberships.length; i++) {
            const teamMembership = teamMemberships[i];
            results.push(await this.createTeamPlayerApiModel(teamMembership));
        }

        return results;
    }

    async createMatchParticipantsApiModel(match: Match): Promise<IMatchParticipantsApiModel> {
        const homeTeam = await this.getTeamFromCacheOrDb(match.homeTeamId);
        if (homeTeam == null) throw new Error("Home Team doesn't exist.")

        const awayTeam = await this.getTeamFromCacheOrDb(match.homeTeamId);
        if (awayTeam == null) throw new Error("Away Team doesn't exist.")

        return {
            awayTeamPlayers: awayTeam.teamMemberships.map((teamMembership) => ApiModelMapper.createMatchTeamPlayerApiModel(match, teamMembership)),
            homeTeamPlayers: homeTeam.teamMemberships.map((teamMembership) => ApiModelMapper.createMatchTeamPlayerApiModel(match, teamMembership))
        }
    }
}

export default ApiModelService;

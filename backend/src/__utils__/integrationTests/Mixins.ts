import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import TeamFactory from "domain/domainFactories/TeamFactory";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";

class Mixins {
    private readonly _teamRepository: ITeamRepository;
    private readonly _playerRepository: IPlayerRepository;

    constructor() {
        this._teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        this._playerRepository = diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY);
    }

    async createTeam(seed: number) {
        const team = TeamFactory.CreateNew({
            id: `${seed}`,
            name: `team_${seed}`,
            dateFounded: new Date(),
            teamMemberships: [],
        });

        await this._teamRepository.createAsync(team);

        return team;
    }

    async createPlayer(seed: number) {
        const player = PlayerFactory.CreateNew({
            id: `${seed}`,
            name: `player_${seed}`,
            activeSince: new Date(),
        });

        await this._playerRepository.createAsync(player);

        return player;
    }

    async createTeamMembership(player: Player, team: Team, activeTo: Date | null, number: number) {
        const result = team.tryAddMember({
            activeFrom: new Date(0),
            activeTo: activeTo,
            playerId: player.id,
            number: number
        });


        if (result.isErr()) {
            throw Error(result.error.message);
        }

        await this._teamRepository.updateAsync(team);

        return result.value;
    }
}

export default Mixins;

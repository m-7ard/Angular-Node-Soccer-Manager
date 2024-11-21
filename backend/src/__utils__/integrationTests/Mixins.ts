import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import TeamFactory from "domain/domainFactories/TeamFactory";

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
            number: (seed % 11) + 1,
        });

        await this._playerRepository.createAsync(player);

        return player;
    }
}

export default Mixins;

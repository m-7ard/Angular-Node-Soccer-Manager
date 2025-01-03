import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import IUidRecord from "api/interfaces/IUidRecord";
import IMatchRepository from "application/interfaces/IMatchRepository";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import IUserRepository from "application/interfaces/IUserRepository";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import TeamFactory from "domain/domainFactories/TeamFactory";
import UserFactory from "domain/domainFactories/UserFactory";
import MatchDomainService from "domain/domainService/MatchDomainService";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";

class Mixins {
    private readonly _teamRepository: ITeamRepository;
    private readonly _playerRepository: IPlayerRepository;
    private readonly _matchRepository: IMatchRepository;
    private readonly _userRepository: IUserRepository;
    private readonly _passwordHasher: IPasswordHasher;

    constructor() {
        this._teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        this._playerRepository = diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY);
        this._matchRepository = diContainer.resolve(DI_TOKENS.MATCH_REPOSITORY);
        this._userRepository = diContainer.resolve(DI_TOKENS.USER_REPOSITORY);
        this._passwordHasher = diContainer.resolve(DI_TOKENS.PASSWORD_HASHER);
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
            activeSince: new Date(Date.now()),
        });

        await this._playerRepository.createAsync(player);

        return player;
    }

    async createTeamMembership(player: Player, team: Team, activeTo: Date | null, number: number) {
        const result = team.tryAddMember({
            activeFrom: new Date(0),
            activeTo: activeTo,
            playerId: player.id,
            number: number,
        });

        if (result.isErr()) {
            throw Error(result.error.message);
        }

        await this._teamRepository.updateAsync(team);

        return result.value;
    }

    async createUser(seed: number, isAdmin: boolean) {
        const password = `hashed_password_${seed}`;
        const user = UserFactory.CreateNew({
            id: `${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: await this._passwordHasher.hashPassword(password),
            isAdmin: isAdmin,
        });

        await this._userRepository.createAsync(user);

        return { user, password };
    }

    async createScheduledMatch(props: { seed: number; awayTeam: Team; homeTeam: Team }) {
        const date = new Date();
        return await this.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: null,
            endDate: null,
            goals: null,
            status: MatchStatus.SCHEDULED.value,
        });
    }

    async createInProgressMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: IUidRecord<{ dateOccured: Date; teamId: string; playerId: string }> }) {
        const date = new Date();
        return await this.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: date,
            endDate: null,
            goals: props.goals,
            status: MatchStatus.IN_PROGRESS.value,
        });
    }

    async createCompletedMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: IUidRecord<{ dateOccured: Date; teamId: string; playerId: string }> }) {
        const date = new Date();
        const endDate = new Date(date);
        date.setMinutes(endDate.getMinutes() + 90);

        return await this.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: date,
            endDate: endDate,
            goals: props.goals,
            status: MatchStatus.COMPLETED.value,
        });
    }

    async createCancelledMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; }) {
        const date = new Date();

        return await this.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: null,
            endDate: null,
            goals: null,
            status: MatchStatus.CANCELLED.value,
        });
    }

    private async createMatch(props: {
        seed: number;
        scheduledDate: Date;
        status: string;
        awayTeam: Team;
        homeTeam: Team;
        startDate: Date | null;
        endDate: null | Date;
        goals: IUidRecord<{ dateOccured: Date; teamId: string; playerId: string }> | null;
    }) {
        const matchResult = MatchDomainService.tryCreateMatch({
            id: `${props.seed}`,
            homeTeam: props.homeTeam,
            awayTeam: props.awayTeam,
            venue: `match_${props.seed}_venue`,
            scheduledDate: props.scheduledDate,
            startDate: props.startDate,
            endDate: props.endDate,
            status: props.status,
            goals: props.goals
        });

        if (matchResult.isErr()) {
            throw new Error(`Errors occured while trying to create match in Mixins: ${JSON.stringify(matchResult.error)}`);
        }

        await this._matchRepository.createAsync(matchResult.value);
        const insertedMatch = await this._matchRepository.getByIdAsync(matchResult.value.id);

        if (insertedMatch == null) {
            throw new Error(`Errors occured while trying to create match in Mixins: Match was not inserted.`);
        }

        return insertedMatch;
    }
}

export default Mixins;

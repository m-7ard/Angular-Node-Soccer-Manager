import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import IMatchRepository from "application/interfaces/IMatchRepository";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import IUserRepository from "application/interfaces/IUserRepository";
import MatchFactory from "domain/domainFactories/MatchFactory";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import TeamFactory from "domain/domainFactories/TeamFactory";
import UserFactory from "domain/domainFactories/UserFactory";
import MatchDomainService from "domain/domainService/MatchDomainService";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import { DateTime } from "luxon";

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
        const teamMembership = team.executeAddMember({
            activeFrom: DateTime.fromJSDate(team.dateFounded).plus({ minute: 1 }).toJSDate(),
            activeTo: activeTo,
            player: player,
            number: number,
        });

        await this._teamRepository.updateAsync(team);
        return teamMembership;
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

    async createInProgressMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: Array<{ dateOccured: Date; teamId: string; playerId: string }> }) {
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

    async createCompletedMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: Array<{ dateOccured: Date; teamId: string; playerId: string }> }) {
        const date = new Date();
        const endDate = DateTime.fromJSDate(date)
            .plus({ minutes: 90 })
            .toJSDate();
        

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

    async createCancelledMatch(props: { seed: number; awayTeam: Team; homeTeam: Team }) {
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
        goals: Array<{ dateOccured: Date; teamId: string; playerId: string }> | null;
    }) {
        const match = MatchFactory.CreateNew({
            id: `${props.seed}`,
            homeTeamId: props.homeTeam.id,
            awayTeamId: props.awayTeam.id,
            venue: `match_${props.seed}_venue`,
            matchDates: MatchDates.executeCreate({
                scheduledDate: props.scheduledDate,
                startDate: props.startDate,
                endDate: props.endDate,
            }),
            status: MatchStatus.executeCreate(props.status),
        });

        if (props.goals != null) {
            match.score = MatchScore.ZeroScore;
            props.goals.forEach(match.executeAddGoal);
        }

        await this._matchRepository.createAsync(match);
        const insertedMatch = await this._matchRepository.getByIdAsync(match.id);

        if (insertedMatch == null) {
            throw new Error(`Errors occured while trying to create match in Mixins: Match was not inserted.`);
        }

        return insertedMatch;
    }
}

export default Mixins;

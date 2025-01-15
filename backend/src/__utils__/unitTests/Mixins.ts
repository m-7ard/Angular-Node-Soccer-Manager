import MatchFactory from "domain/domainFactories/MatchFactory";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import TeamFactory from "domain/domainFactories/TeamFactory";
import UserFactory from "domain/domainFactories/UserFactory";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import { DateTime } from "luxon";

class Mixins {
    static createTeam(seed: number) {
        const team = TeamFactory.CreateNew({
            id: TeamId.executeCreate(`${seed}`),
            name: `team_${seed}`,
            dateFounded: new Date(),
            teamMemberships: [],
        });

        return team;
    }

    static createPlayer(seed: number) {
        const player = PlayerFactory.CreateNew({
            id: PlayerId.executeCreate(`${seed}`),
            name: `player_${seed}`,
            activeSince: new Date(Date.now()),
        });

        return player;
    }

    static createTeamMembership(player: Player, team: Team, activeTo: Date | null) {
        const teamMembershipId = team.executeAddMember({
            id: crypto.randomUUID(),
            activeFrom: DateTime.fromJSDate(team.dateFounded).plus({ minute: 1 }).toJSDate(),
            activeTo: activeTo,
            player: player,
        });

        return team.executeFindMemberById(teamMembershipId);
    }

    static createUser(seed: number, isAdmin: boolean) {
        const password = `hashed_password_${seed}`;
        const user = UserFactory.CreateNew({
            id: `${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: password,
            isAdmin: isAdmin,
        });

        return { user, password };
    }

    static createScheduledMatch(props: { seed: number; awayTeam: Team; homeTeam: Team }) {
        const date = new Date();
        return Mixins.createMatch({
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

    static createInProgressMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: Array<{ dateOccured: Date; team: Team; player: Player }> }) {
        const date = new Date();
        return Mixins.createMatch({
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

    static createCompletedMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: Array<{ dateOccured: Date; team: Team; player: Player }> }) {
        const date = new Date();
        const endDate = DateTime.fromJSDate(date)
            .plus({ minutes: 90 })
            .toJSDate();
        

        return Mixins.createMatch({
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

    static createCancelledMatch(props: { seed: number; awayTeam: Team; homeTeam: Team }) {
        const date = new Date();

        return Mixins.createMatch({
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

    private static createMatch(props: {
        seed: number;
        scheduledDate: Date;
        status: string;
        awayTeam: Team;
        homeTeam: Team;
        startDate: Date | null;
        endDate: null | Date;
        goals: Array<{ dateOccured: Date; team: Team; player: Player }> | null;
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
            props.goals.forEach((goal) => {
                match.executeAddGoal({ dateOccured: goal.dateOccured, team: goal.team, player: goal.player})
            });
        }


        return match;
    }
}

export default Mixins;

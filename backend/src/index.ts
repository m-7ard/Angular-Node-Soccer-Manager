import createApplication from "api/createApplication";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import responseLogger from "api/middleware/responseLogger";
import getMigrations from "api/utils/getMigrations";
import MatchFactory from "domain/domainFactories/MatchFactory";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import TeamFactory from "domain/domainFactories/TeamFactory";
import UserFactory from "domain/domainFactories/UserFactory";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import MySQLDatabaseService from "infrastructure/services/MySQLDatabaseService";

const hostname = "127.0.0.1";
const environment = (process.env.NODE_ENV || 'DEVELOPMENT') as "DEVELOPMENT" | "PRODUCTION";
const port = process.env.PORT == null ? 4200 : parseInt(process.env.PORT);

async function main() {
    const db = new MySQLDatabaseService({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "adminword",
    });

    const migrations = await getMigrations();
    await db.initialise(migrations);

    const app = createApplication({
        port: port,
        middleware: [responseLogger],
        database: db,
        mode: environment
    });

    const server = app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });

    const teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
    const userRepository = diContainer.resolve(DI_TOKENS.USER_REPOSITORY);
    const playerRepository = diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY);
    const matchRepository = diContainer.resolve(DI_TOKENS.MATCH_REPOSITORY);
    const passwordHasher = diContainer.resolve(DI_TOKENS.PASSWORD_HASHER);

    const adminUser = UserFactory.CreateNew({ id: crypto.randomUUID(), name: "admin", email: "admin@mail.com", hashedPassword: await passwordHasher.hashPassword("adminword"), isAdmin: true });
    await userRepository.createAsync(adminUser);

    const fantasyTeam = TeamFactory.CreateNew({ id: TeamId.executeCreate(crypto.randomUUID()), dateFounded: new Date(), name: "Fantasy Team", teamMemberships: [] });
    const localTeam = TeamFactory.CreateNew({ id: TeamId.executeCreate(crypto.randomUUID()), dateFounded: new Date(), name: "Local Team", teamMemberships: [] });
    await teamRepository.createAsync(fantasyTeam);
    await teamRepository.createAsync(localTeam);

    const johnDoe = PlayerFactory.CreateNew({ id: PlayerId.executeCreate(crypto.randomUUID()), name: "John Doe", activeSince: new Date() });
    const janeDoe = PlayerFactory.CreateNew({ id: PlayerId.executeCreate(crypto.randomUUID()), name: "Jane Doe", activeSince: new Date() });
    await playerRepository.createAsync(johnDoe);
    await playerRepository.createAsync(janeDoe);

    const johnDoeMembershipId = localTeam.executeAddMember({ id: crypto.randomUUID(), player: johnDoe, activeFrom: new Date(), activeTo: null });
    localTeam.executeAddHistoryToTeamMembership(johnDoeMembershipId, { id: crypto.randomUUID(), number: 1, position: TeamMembershipHistoryPosition.GOALKEEPER.value, dateEffectiveFrom: new Date() });

    await teamRepository.updateAsync(localTeam);

    const scheduledMatch = MatchFactory.CreateNew({
        id: crypto.randomUUID(),
        awayTeamId: localTeam.id,
        homeTeamId: fantasyTeam.id,
        matchDates: MatchDates.executeCreate({ scheduledDate: new Date(), startDate: null, endDate: null }),
        status: MatchStatus.SCHEDULED,
        venue: "venue",
    });
    await matchRepository.createAsync(scheduledMatch);
}

try {
    main();
} catch (err: any) {
    process.exit();
}

import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import { db, setUpIntegrationTest, disposeIntegrationTest, resetIntegrationTest, server } from "__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import ICreateMatchRequestDTO from "api/DTOs/matches/create/ICreateMatchRequestDTO";
import Team from "domain/entities/Team";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import supertest from "supertest";

let team_001: Team;
let team_002: Team;
let default_request: ICreateMatchRequestDTO;

const wasCreated = async () => {
    const rows = await db.query<IMatchSchema>({
        statement: "SELECT * FROM matches",
    });
    expect(rows.length).toBe(1);
};

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
    const mixins = new Mixins();
    team_001 = await mixins.createTeam(1);
    team_002 = await mixins.createTeam(2);

    default_request = {
        awayTeamId: team_001.id,
        homeTeamId: team_002.id,
        score: null,
        scheduledDate: new Date(),
        startDate: null,
        endDate: null,
        venue: "venue place",
        status: MatchStatus.SCHEDULED.value,
    };
});

describe("Create Match Integration Test - Happy Paths", () => {
    it("Create Scheduled Match", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create In Progress Match", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.IN_PROGRESS.value;
        request.startDate = new Date();
        request.score = {
            awayTeamScore: 0,
            homeTeamScore: 0,
        };

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create Completed Match", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.COMPLETED.value;

        const startDate = new Date();
        startDate.setHours(10, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(11, 30, 0, 0); // 90 minutes later

        request.startDate = startDate;
        request.endDate = endDate;
        request.score = {
            awayTeamScore: 2,
            homeTeamScore: 1,
        };

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create Cancelled Match", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.CANCELLED.value;

        const response = await adminSuperTest({
            agent: supertest(server).post(`/api/matches/create`).send(request).set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });
});

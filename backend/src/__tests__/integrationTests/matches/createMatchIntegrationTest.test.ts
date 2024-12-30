import supertest from "supertest";
import {
    db,
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import ICreateMatchRequestDTO from "api/DTOs/matches/create/ICreateMatchRequestDTO";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";

let team_001: Team;
let team_002: Team;

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
});

describe("Create Match Integration Test;", () => {
    it("Create Match; Valid Data (null scores); Success;", async () => {
        const startTime = new Date();
        startTime.setHours(10, 0, 0, 0)
        const request: ICreateMatchRequestDTO = {
            awayTeamId: team_001.id,
            homeTeamId: team_002.id,
            awayTeamScore: null,
            homeTeamScore: null,
            scheduledDate: new Date(),
            startTime: startTime,
            endTime: null,
            venue: "venue place",
            status: MatchStatus.SCHEDULED.value
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        const rows = await db.query<ITeamMembershipSchema>({
            statement: "SELECT * FROM matches",
        });
        expect(rows.length).toBe(1);
    });
});

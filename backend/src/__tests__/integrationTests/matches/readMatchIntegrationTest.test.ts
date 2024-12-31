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
import Match from "domain/entities/Match";
import IReadMatchResponseDTO from "api/DTOs/matches/read/IReadMatchResponseDTO";

let team_001: Team;
let team_002: Team;
let match_001: Match;

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
    match_001 = await mixins.createScheduledMatch({
        seed: 1,
        awayTeam: team_001,
        homeTeam: team_002,
    });
});

describe("Read Match Integration Test;", () => {
    it("Read Match; Existing Match; Success;", async () => {
        const response = await adminSuperTest({
            agent: supertest(server)
                .get(`/api/matches/${match_001.id}`)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        const body: IReadMatchResponseDTO = response.body;
        expect(body.match.id).toBe(match_001.id);
    });

    it("Read Match; Match does not exist; Failure;", async () => {
        const response = await adminSuperTest({
            agent: supertest(server)
                .get(`/api/matches/${"does_not_exist"}`)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(404);
    });
});

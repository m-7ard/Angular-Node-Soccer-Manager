import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import { db, disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import Team from "domain/entities/Team";
import Mixins from "__utils__/integrationTests/Mixins";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import IDeleteTeamRequestDTO from "api/DTOs/teams/delete/IDeleteTeamRequestDTO";
import IReadTeamResponseDTO from "api/DTOs/teams/read/IReadTeamResponseDTO";
import IReadTeamRequestDTO from "api/DTOs/teams/read/IReadTeamRequestDTO";

let team_001: Team;

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
});

describe("Read Team Integration Test;", () => {
    it("Read Team; Valid Data; Success;", async () => {
        const request: IReadTeamRequestDTO = {};

        const response = await supertest(server).get(`/api/teams/${team_001.id}`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IReadTeamResponseDTO = response.body;

        expect(body.team == null).toBe(false);
    });

    it("Read Team; Team does not exist; Failure;", async () => {
        const request: IReadTeamRequestDTO = {};

        const response = await supertest(server).get(`/api/teams/${"100"}`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(404);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});

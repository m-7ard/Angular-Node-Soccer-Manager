import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import ICreateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/create/ICreateTeamMembershipRequestDTO";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import Player from "domain/entities/Player";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";

let team_001: Team;
let player_001: Player;

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
    player_001 = await mixins.createPlayer(1);

    expect(team_001).toBeDefined();
    expect(player_001).toBeDefined();
});

describe("Create TeamMembership Integration Test;", () => {
    it("Create Team Membership; Valid Data; Success;", async () => {
        const request: ICreateTeamMembershipRequestDTO = {
            playerId: player_001.id,
            activeFrom: new Date(),
            activeTo: null,
        };

        const response = await supertest(server).post(`/api/teams/${team_001.id}/create-membership`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(201);
    });

    /*
    it("Create Team Membership; Invalid Data (Validation); Success;", async () => {
        const request: ICreateTeamMembershipRequestDTO = {
            teamId: team_001.id,
            playerId: player_001.id,
            activeFrom: new Date(),
            activeTo: null,
        };

        const response = await supertest(server).post(`/api/teams/${team_001.id}/create-membership`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
    */

    it("Create Team Membership; Team does not exist; Failure;", async () => {
        const INVALID_TEAM_ID = "INVALID";

        const request: ICreateTeamMembershipRequestDTO = {
            playerId: player_001.id,
            activeFrom: new Date(),
            activeTo: null,
        };

        const response = await supertest(server).post(`/api/teams/${INVALID_TEAM_ID}/create-membership`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
    /*
    it("Create Team Membership; Plauer does not exist; Failure;", async () => {
        const request: ICreateTeamMembershipRequestDTO = {
            teamId: team_001.id,
            playerId: "invalid",
            activeFrom: new Date(),
            activeTo: null,
        };

        const response = await supertest(server).post(`/api/teams/${team_001.id}/create-membership`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });*/
});

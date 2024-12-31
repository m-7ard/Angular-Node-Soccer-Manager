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
import ICreateMatchRequestDTO from "api/DTOs/matches/create/ICreateMatchRequestDTO";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";

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
        awayTeamScore: null,
        homeTeamScore: null,
        scheduledDate: new Date(),
        startTime: new Date(),
        endTime: null,
        venue: "venue place",
        status: MatchStatus.SCHEDULED.value,
    };
});

describe("Create Match Integration Test;", () => {
    /***
       * @Schulded Matches   
    ***/
    it("Create Scheduled Match; Valid Data; Success;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    /***
       * @Completed Matches   
    ***/
    it("Create Completed Match; Valid Data; Create;", async () => {
        const request = { ...default_request };

        const startTime = new Date();
        startTime.setHours(10, 0, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(11, 30, 0, 0);

        request.startTime = startTime;
        request.endTime = endTime;

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
    });

    it("Create Completed Match; Missing endTime; Failure;", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.COMPLETED.value;
        request.awayTeamScore = 1;
        request.homeTeamScore = 1;

        const startTime = new Date();
        startTime.setHours(10, 0, 0, 0);

        request.startTime = startTime;

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });

    it("Create Completed Match; Less than 90 minutes; Failure;", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.COMPLETED.value
        request.awayTeamScore = 1;
        request.homeTeamScore = 1;

        const startTime = new Date();
        startTime.setHours(10, 0, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(11, 0, 0, 0);

        request.startTime = startTime;
        request.endTime = endTime;

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });

    /***
       * @In Progress Matches   
    ***/
    it("Create In Progress Match; Valid Data; Success;", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.IN_PROGRESS.value;
        request.awayTeamScore = 1;
        request.homeTeamScore = 1;

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Create In Progress Match; Null Scores; Failure;", async () => {
        const request = { ...default_request };
        request.status = MatchStatus.IN_PROGRESS.value;

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});

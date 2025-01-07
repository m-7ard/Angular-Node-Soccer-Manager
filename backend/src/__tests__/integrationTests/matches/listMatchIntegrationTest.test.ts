import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import Match from "domain/entities/Match";
import IListMatchesRequestDTO from "api/DTOs/matches/list/IListMatchesRequestDTO";
import urlWithQuery from "__utils__/integrationTests/urlWithQuery";
import IListMatchesResponseDTO from "api/DTOs/matches/list/IListMatchesResponseDTO";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";

const BASE_URL = "/api/matches/";

let team_001: Team;
let team_002: Team;
let team_003: Team;

let match_001: Match;
let match_002: Match;
let match_003: Match;

let default_request: IListMatchesRequestDTO = {
    limitBy: null,
    scheduledDate: null,
    status: null,
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

    match_001 = await mixins.createScheduledMatch({
        seed: 1,
        awayTeam: team_001,
        homeTeam: team_002,
    });

    match_002 = await mixins.createCompletedMatch({
        seed: 2,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: [],
    });

    match_003 = await mixins.createCompletedMatch({
        seed: 3,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: [],
    });
});

describe("List Matches Integration Test;", () => {
    it("List Matches; No Params; Success;", async () => {
        const request = { ...default_request };
        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server)
            .get(`${url}`)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListMatchesResponseDTO = response.body;
        expect(body.matches.length).toBe(3);
    });

    test.each([[0, 3]])(
        "List Matches; scheduledDate; Success;",
        async (addDays, expectAmount) => {
            const request = { ...default_request };
            request.scheduledDate = match_001.matchDates.scheduledDate;
            request.scheduledDate.setDate(
                request.scheduledDate.getDate() + addDays,
            );

            const response = await supertest(server)
                .get(BASE_URL)
                .query(request)
                .set("Content-Type", "application/json");

            expect(response.status).toBe(200);
            const body: IListMatchesResponseDTO = response.body;
            expect(body.matches.length).toBe(expectAmount);
        },
    );

    test.each([
        [MatchStatus.COMPLETED, 2],
        [MatchStatus.SCHEDULED, 1],
        [MatchStatus.CANCELLED, 0],
        [MatchStatus.IN_PROGRESS, 0],
    ])("List Matches; status; Success;", async (status, expectAmount) => {
        const request = { ...default_request };
        request.status = status.value;

        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server)
            .get(`${url}`)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListMatchesResponseDTO = response.body;
        expect(body.matches.length).toBe(expectAmount);
    });
});

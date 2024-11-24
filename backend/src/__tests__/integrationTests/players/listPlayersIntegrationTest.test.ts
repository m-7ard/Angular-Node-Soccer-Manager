import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import Player from "domain/entities/Player";
import IListPlayersRequestDTO from "api/DTOs/players/list/IListPlayersRequestDTO";
import IListPlayersResponseDTO from "api/DTOs/players/list/IListPlayersResponseDTO";

let player_001: Player;
let player_002: Player;
let player_003: Player;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();
    player_001 = await mixins.createPlayer(1);
    player_002 = await mixins.createPlayer(2);
    player_003 = await mixins.createPlayer(3);
});

describe("List Players Integration Test;", () => {
    it("List Players; No Args; Success;", async () => {
        const request: IListPlayersRequestDTO = {
            name: null
        };

        const response = await supertest(server).get("/api/players/").send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListPlayersResponseDTO = response.body;
        expect(body.players).toHaveLength(3);
    });

    it("List Players; Like Name; Success;", async () => {
        const request: IListPlayersRequestDTO = {
            name: player_001.name
        };

        const response = await supertest(server).get("/api/players/").send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListPlayersResponseDTO = response.body;
        expect(body.players).toHaveLength(1);
    });
});

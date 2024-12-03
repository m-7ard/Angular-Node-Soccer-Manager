import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import { db, disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import Player from "domain/entities/Player";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import IDeletePlayerRequestDTO from "api/DTOs/players/delete/IDeletePlayerRequestDTO";

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
    player_001 = await mixins.createPlayer(1);
});

describe("Delete Player Integration Test;", () => {
    it("Delete Player; Valid Data; Success;", async () => {
        const request: IDeletePlayerRequestDTO = {};

        const response = await supertest(server).delete(`/api/players/${player_001.id}/delete`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);

        const [row] = await db.query<IPlayerSchema | null>({ statement: `SELECT * FROM player WHERE id = ${player_001.id}` });
        expect(row == null).toBe(true);
    });

    it("Delete Player; Player does not exist; Failure;", async () => {
        const request: IDeletePlayerRequestDTO = {};

        const response = await supertest(server).delete(`/api/players/${"100"}/delete`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});

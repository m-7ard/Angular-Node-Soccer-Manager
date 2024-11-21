import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import ICreatePlayerRequestDTO from "api/DTOs/players/create/ICreatePlayerRequestDTO";

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
});

describe("Create Player Integration Test;", () => {
    it("Create Player; Valid Data; Success;", async () => {
        const request: ICreatePlayerRequestDTO = {
            name: "name",
            activeSince: new Date(),
            number: 5,
        };

        const response = await supertest(server)
            .post("/api/players/create")
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });
    
    it("Create Player; Invalid Data (Empty name); Failure;", async () => {
        const request: ICreatePlayerRequestDTO = {
            name: "",
            activeSince: new Date(),
            number: 5,
        };

        const response = await supertest(server)
            .post("/api/players/create")
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
});

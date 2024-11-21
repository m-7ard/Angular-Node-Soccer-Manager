import createApplication from "api/createApplication";
import IDatabaseService from "api/interfaces/IDatabaseService";
import responseLogger from "api/middleware/responseLogger";
import getMigrations from "api/utils/getMigrations";
import { Server } from "http";
import MySQLDatabaseService from "infrastructure/MySQLDatabaseService";

export let db: IDatabaseService;
export let server: Server;

export async function setUpIntegrationTest() {
    db = new MySQLDatabaseService({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "adminword",
    });

    const app = createApplication({
        port: 3000,
        middleware: [responseLogger],
        database: db,
    });

    server = app.listen();
}

export async function disposeIntegrationTest() {
    server.close((err) => console.log(err));
    await db.dispose();
}

export async function resetIntegrationTest() {
    const migrations = await getMigrations();
    await db.initialise(migrations);
}
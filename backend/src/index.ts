import createApplication from "api/createApplication";
import responseLogger from "api/middleware/responseLogger";
import getMigrations from "api/utils/getMigrations";
import MySQLDatabaseService from "infrastructure/MySQLDatabaseService";

const hostname = "127.0.0.1";
const port = 3000;

async function main() {
    const db = new MySQLDatabaseService({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "adminword",
    });
    
    const migrations = await getMigrations();
    await db.initialise(migrations);
    
    const app = createApplication({
        port: 3000,
        middleware: [responseLogger],
        database: db,
    });

    
    const server = app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

try {
    main();
} catch (err: any) {
    process.exit();
}

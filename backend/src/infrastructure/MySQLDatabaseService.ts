import mysql, { ResultSetHeader } from "mysql2/promise";
import IDatabaseService from "../api/interfaces/IDatabaseService";

class MySQLDatabaseService implements IDatabaseService {
    private readonly _pool: mysql.Pool;
    private readonly _config: mysql.PoolOptions;

    constructor(config: mysql.PoolOptions) {
        this._pool = mysql.createPool(config);
        this._config = config;
    }

    async initialise(migrations: string[]): Promise<void> {
        await this._pool.query(`DROP DATABASE IF EXISTS football_manager`);
        await this._pool.query(`CREATE DATABASE football_manager`);
        await this._pool.query(`USE football_manager;`);

        for (const migration of migrations) {
            await this._pool.query(migration);
        }
    }

    async dispose(): Promise<void> {
        await this._pool.query(`DROP DATABASE IF EXISTS football_manager`);
    }

    async query<T = mysql.ResultSetHeader>(args: { statement: string }): Promise<T> {
        const { statement } = args;
        const [query] = await this._pool.query<T & mysql.RowDataPacket[]>(statement);
        return query;
    }

    async execute<T = mysql.ResultSetHeader>(args: { statement: string; parameters: Array<unknown> }): Promise<T> {
        const { statement, parameters } = args;
        const [query] = await this._pool.execute<T & mysql.RowDataPacket[]>(statement, parameters);
        return query;
    }
}

export default MySQLDatabaseService;

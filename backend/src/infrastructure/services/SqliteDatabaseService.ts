import IDatabaseService, { TResultHeader } from "api/interfaces/IDatabaseService";
import sqlite, { Database } from "better-sqlite3";
import { existsSync, unlinkSync } from "fs";
import path from "path";

class SqliteDatabaseService implements IDatabaseService {
    private _db: Database;
    private dbPath: string = path.join(__dirname, "football_manager.db");

    constructor() {
        if (existsSync(this.dbPath)) {
            unlinkSync(this.dbPath);
        }
        
        this._db = sqlite("football_manager.db");
        this._db.pragma("journal_mode = WAL");
    }

    async initialise(migrations: string[]): Promise<void> {
        for (const migration of migrations) {
            this._db.exec(migration);
        }
    }

    async dispose(): Promise<void> {
        if (existsSync(this.dbPath)) {
            unlinkSync(this.dbPath);
        }
    }

    async queryRows<T>(args: { statement: string }): Promise<T[]> {
        const { statement } = args;
        const query = this._db.prepare(statement).all();
        return query as T[];
    }

    async executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]> {
        const { statement, parameters } = args;
        const [query] = this._db.prepare(statement).all(parameters);
        return query as T[];
    }

    async queryHeaders(args: { statement: string; }): Promise<TResultHeader> {
        const { statement } = args;
        const headers = this._db.prepare(statement).run();
        return { affectedRows: headers.changes };
    }

    async executeHeaders<T>(args: { statement: string; parameters: Array<unknown>; }): Promise<TResultHeader> {
        const { statement, parameters } = args;
        const headers = this._db.prepare(statement).run(parameters);
        return { affectedRows: headers.changes };
    }
}

export default SqliteDatabaseService;

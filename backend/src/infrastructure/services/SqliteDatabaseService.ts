import IDatabaseService, { TResultHeader } from "api/interfaces/IDatabaseService";
import sqlite, { Database } from "better-sqlite3";
import { existsSync, unlinkSync } from "fs";
import path from "path";

class SqliteDatabaseService implements IDatabaseService {
    private _db: Database = null!;
    private _dbPath: string = path.join(process.cwd(), "football_manager.db");
    public readonly __type = "sqlite3";

    private _cleanParams(params: Array<unknown>) {
        return params.map((value) => (value instanceof Date ? value.toISOString().slice(0, 19).replace("T", " ") : value));
    }

    constructor() {}

    /*
    
    Note: this isn't functional as it requires a mapping of the dates saved as strings to be converted
    back to dates
    
    */

    async initialise(migrations: string[]): Promise<void> {
        if (existsSync(this._dbPath)) {
            this._db?.close();
            unlinkSync(this._dbPath);
        }

        this._db = sqlite("football_manager.db");
        this._db.pragma("journal_mode = WAL");

        for (const migration of migrations) {
            this._db.exec(migration);
        }
    }

    async dispose(): Promise<void> {
            this._db.close();
            
            if (existsSync(this._dbPath)) {
            unlinkSync(this._dbPath);
        }
    }

    async queryRows<T>(args: { statement: string }): Promise<T[]> {
        const { statement } = args;
        const query = this._db.prepare(statement).all();
        return query as T[];
    }

    async executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]> {
        const { statement, parameters } = args;
        const query = this._db.prepare(statement).all(this._cleanParams(parameters));
        return query as T[];
    }

    async queryHeaders(args: { statement: string }): Promise<TResultHeader> {
        const { statement } = args;
        const headers = this._db.prepare(statement).run();
        return { affectedRows: headers.changes };
    }

    async executeHeaders<T>(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader> {
        const { statement, parameters } = args;
        const headers = this._db.prepare(statement).run(this._cleanParams(parameters));
        return { affectedRows: headers.changes };
    }
}

export default SqliteDatabaseService;

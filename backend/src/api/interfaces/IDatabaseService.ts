import { ResultSetHeader } from "mysql2";

interface IDatabaseService {
    initialise(migrations: string[]): Promise<void>;
    dispose(): Promise<void>;
    query<T = ResultSetHeader>(args: { statement: string }): Promise<T[]>;
    execute<T = ResultSetHeader>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]>;
}

export default IDatabaseService;

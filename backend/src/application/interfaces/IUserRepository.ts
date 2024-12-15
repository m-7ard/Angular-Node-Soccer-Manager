import User from "../../domain/entities/User";

interface IUserRepository {
    createAsync(team: User): Promise<void>;
    updateAsync(team: User): Promise<void>;
    getByIdAsync(id: string): Promise<User | null>;
    getByEmailAsync(email: string): Promise<User | null>;
    deleteAsync(team: User): Promise<void>;
}

export default IUserRepository;
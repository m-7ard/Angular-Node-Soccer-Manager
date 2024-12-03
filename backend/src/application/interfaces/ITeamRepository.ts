import Team from "../../domain/entities/Team";

interface ITeamRepository {
    createAsync(team: Team): Promise<void>;
    updateAsync(team: Team): Promise<void>;
    getByIdAsync(id: string): Promise<Team | null>;
    deleteAsync(team: Team): Promise<void>;
    findAllAsync(): Promise<Team[]>;
}

export default ITeamRepository;
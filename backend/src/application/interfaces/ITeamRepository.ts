import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";
import Team from "../../domain/entities/Team";
import TeamId from "domain/valueObjects/Team/TeamId";

interface ITeamRepository {
    createAsync(team: Team): Promise<void>;
    updateAsync(team: Team): Promise<void>;
    getByIdAsync(id: TeamId): Promise<Team | null>;
    deleteAsync(team: Team): Promise<void>;
    filterAllAsync(criteria: FilterAllTeamsCriteria): Promise<Team[]>;
}

export default ITeamRepository;
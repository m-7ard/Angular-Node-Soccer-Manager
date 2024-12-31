import Match from "domain/entities/Match";
import FilterAllMatchesCriteria from "infrastructure/contracts/FilterAllMatchesCriteria";

interface IMatchRepository {
    createAsync(team: Match): Promise<void>;
    getByIdAsync(id: string): Promise<Match | null>;
    filterAllAsync(criteria: FilterAllMatchesCriteria): Promise<Match[]>;
}

export default IMatchRepository;
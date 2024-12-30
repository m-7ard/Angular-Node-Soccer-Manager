import Match from "domain/entities/Match";

interface IMatchRepository {
    createAsync(team: Match): Promise<void>;
    getByIdAsync(id: string): Promise<Match | null>;
}

export default IMatchRepository;
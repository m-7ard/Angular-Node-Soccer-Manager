import Player from "domain/entities/Player";
import IDatabaseService from "../../api/interfaces/IDatabaseService";
import IPlayerRepository from "../../application/interfaces/IPlayerRepository";
import PlayerMapper from "infrastructure/mappers/PlayerMapper";
import PlayerDbEntity from "infrastructure/dbEntities/PlayerDbEntity";
import knexQueryBuilder from "api/deps/knexQueryBuilder";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import FilterAllPlayersCriteria from "infrastructure/contracts/FilterAllPlayersCriteria";
import PlayerId from "domain/valueObjects/Player/PlayerId";

class PlayerRepository implements IPlayerRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
    }

    async deleteAsync(player: Player): Promise<void> {
        const dbEntity = PlayerMapper.domainToDbEntity(player);
        const sqlEntry = dbEntity.getDeleteStatement();

        const headers = await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (headers.affectedRows === 0) {
            throw Error(`No Player of id "${player.id} was deleted."`);
        }
    }

    async getByIdAsync(id: PlayerId): Promise<Player | null> {
        const sqlEntry = PlayerDbEntity.getByIdStatement(id.value);
        const [player] = await this._db.execute<PlayerDbEntity | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        return player == null ? null : PlayerMapper.dbEntityToDomain(player);
    }

    async createAsync(player: Player): Promise<Player> {
        const dbEntity = PlayerMapper.domainToDbEntity(player);
        const sqlEntry = dbEntity.getInsertStatement();

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        return player;
    }

    async updateAsync(player: Player): Promise<Player> {
        const dbEntity = PlayerMapper.domainToDbEntity(player);
        const sqlEntry = dbEntity.getUpdateStatement();

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        return player;
    }

    async findAllAsync(criteria: FilterAllPlayersCriteria): Promise<Player[]> {
        let query = knexQueryBuilder<IPlayerSchema>("player");

        if (criteria.name != null) {
            query = query.whereILike("name", `%${criteria.name}%`);
        }

        if (criteria.limitBy != null) {
            query = query.limit(criteria.limitBy);
        }

        const rows = await this._db.query<IPlayerSchema>({
            statement: query.toString(),
        });
        const players = rows.map(PlayerMapper.schemaToDbEntity);
        return players.map(PlayerMapper.dbEntityToDomain);
    }
}

export default PlayerRepository;

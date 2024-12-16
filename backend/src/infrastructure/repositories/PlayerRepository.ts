import Player from "domain/entities/Player";
import IDatabaseService from "../../api/interfaces/IDatabaseService";
import IPlayerRepository from "../../application/interfaces/IPlayerRepository";
import sql from "sql-template-tag";
import PlayerMapper from "infrastructure/mappers/PlayerMapper";
import PlayerDbEntity from "infrastructure/dbEntities/PlayerDbEntity";
import knexQueryBuilder from "api/deps/knexQueryBuilder";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import toSqlDate from "utils/toSqlDate";
import FilterAllPlayersCriteria from "infrastructure/contracts/FilterAllPlayersCriteria";

class PlayerRepository implements IPlayerRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
    }

    async deleteAsync(player: Player): Promise<void> {
        const sqlEntry = sql`
            DELETE FROM player WHERE
                id = ${player.id}
        `;

        const headers = await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (headers.affectedRows === 0) {
            throw Error(`No Player of id "${player.id} was deleted."`);
        }
    }

    async getByIdAsync(id: string): Promise<Player | null> {
        const sqlEntry = sql`
            SELECT * FROM player WHERE
                id = ${id}
        `;

        const [player] = await this._db.execute<PlayerDbEntity | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        return player == null ? null : PlayerMapper.dbEntityToDomain(player);
    }

    async createAsync(player: Player): Promise<Player> {
        const sqlEntry = sql`
            INSERT INTO player
                SET 
                    id = ${player.id},
                    name = ${player.name},
                    active_since = ${toSqlDate(player.activeSince)}
        `;

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        return player;
    }

    async updateAsync(player: Player): Promise<Player> {
        const sqlEntry = sql`
            UPDATE player
                SET
                    name = ${player.name},
                    active_since = ${player.activeSince}
                WHERE
                    id = ${player.id}
        `;

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

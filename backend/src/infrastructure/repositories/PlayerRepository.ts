import Player from "domain/entities/Player";
import IDatabaseService from "../../api/interfaces/IDatabaseService";
import IPlayerRepository from "../../application/interfaces/IPlayerRepository";
import sql from "sql-template-tag";
import PlayerMapper from "infrastructure/mappers/PlayerMapper";
import PlayerDbEntity from "infrastructure/dbEntities/PlayerDbEntity";
import knexQueryBuilder from "api/deps/knexQueryBuilder";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";

class PlayerRepository implements IPlayerRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
    }

    async getByIdAsync(id: string): Promise<Player | null> {
        const sqlEntry = sql`
            SELECT * FROM player WHERE
                id = '${id}'
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
                    active_since = ${player.activeSince},
                    number = ${player.number}
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
                id = ${player.id}
                name = ${player.name}
                active_since = ${player.activeSince}
                number = ${player.number}
        `;

        await this._db.execute({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        return player;
    }

    async findAllAsync(criteria: { name: string | null; }): Promise<Player[]> {
        let query = knexQueryBuilder<IPlayerSchema>("player");
        if (criteria.name != null) {
            query = query.whereILike("name", `%${criteria.name}%`);
        }

        const rows = await this._db.query<IPlayerSchema>({ statement: query.toString() });
        const players = rows.map(PlayerMapper.schemaToDbEntity);
        
        return players.map(PlayerMapper.dbEntityToDomain);
    }
}

export default PlayerRepository;

import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IApplicationError from "application/errors/IApplicationError";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import Player from "domain/entities/Player";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import { Result, err, ok } from "neverthrow";

class PlayerExistsValidator implements IPlayerValidator<PlayerId> {
    constructor(private readonly playerRepository: IPlayerRepository) {}

    async validate(id: PlayerId): Promise<Result<Player, IApplicationError[]>> {
        const player = await this.playerRepository.getByIdAsync(id);

        if (player == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Player of id "${id}" does not exist.`,
                    code: APPLICATION_SERVICE_CODES.PLAYER_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(player);
    }
}

export default PlayerExistsValidator;

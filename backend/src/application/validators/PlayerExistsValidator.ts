import APPLICATION_VALIDATOR_CODES from "application/errors/APPLICATION_VALIDATOR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import IValidator from "application/interfaces/IValidator";
import Player from "domain/entities/Player";
import { Result, err, ok } from "neverthrow";

class PlayerExistsValidator implements IValidator<{ id: string }, Player> {
    constructor(private readonly playerRepository: IPlayerRepository) {}

    async validate(input: { id: string }): Promise<Result<Player, IApplicationError[]>> {
        const player = await this.playerRepository.getByIdAsync(input.id);

        if (player == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Player of id "${input.id}" does not exist.`,
                    code: APPLICATION_VALIDATOR_CODES.PLAYER_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(player);
    }
}

export default PlayerExistsValidator;

import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IPlayerRepository from "application/interfaces/IPlayerRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamRepository from "application/interfaces/ITeamRepository";
import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";

export type DeletePlayerCommandResult = ICommandResult<IApplicationError[]>;

export class DeletePlayerCommand implements ICommand<DeletePlayerCommandResult> {
    __returnType: DeletePlayerCommandResult = null!;

    constructor({ id,  }: { id: string;  }) {
        this.id = id;
    }

    public id: string;
}

export default class CreateTeamCommandHandler implements IRequestHandler<DeletePlayerCommand, DeletePlayerCommandResult> {
    private readonly _playerRepository: IPlayerRepository;
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { playerRepository: IPlayerRepository; teamRepository: ITeamRepository; }) {
        this._playerRepository = props.playerRepository;
        this._teamRepository = props.teamRepository;
    }

    async handle(command: DeletePlayerCommand): Promise<DeletePlayerCommandResult> {
        const player = await this._playerRepository.getByIdAsync(command.id);
        if (player == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Player of id "${command.id}" does not exist.`,
                    path: ["_"],
                    code: VALIDATION_ERROR_CODES.ModelAlreadyExists,
                }),
            );
        }

        const criteria = new FilterAllTeamsCriteria({
            name: null,
            teamMembershipPlayerId: player.id,
            limitBy: null
        });
        const teamMemberships = await this._teamRepository.filterAllAsync(criteria);
        if (teamMemberships.length > 0) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Team memberships linked to player of id "${command.id}" still exist. Delete the team memberships before you delete the player.`,
                    path: ["_"],
                    code: VALIDATION_ERROR_CODES.IntegrityError,
                }),
            ); 
        }

        await this._playerRepository.deleteAsync(player);
        return ok(undefined);
    }
}

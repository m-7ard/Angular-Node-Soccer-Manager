import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import validationErrorCodes from "application/errors/validationErrorCodes";

export type DeleteTeamCommandResult = ICommandResult<IApplicationError[]>;

export class DeleteTeamCommand implements ICommand<DeleteTeamCommandResult> {
    __returnType: DeleteTeamCommandResult = null!;

    constructor({ id }: { id: string; }) {
        this.id = id;
    }

    public id: string;
}

export default class DeleteTeamCommandHandler implements IRequestHandler<DeleteTeamCommand, DeleteTeamCommandResult> {
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { teamRepository: ITeamRepository }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(command: DeleteTeamCommand): Promise<DeleteTeamCommandResult> {
        const team = await this._teamRepository.getByIdAsync(command.id);
        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Team of id "${command.id}" does not exist.`,
                    path: ["_"],
                    code: validationErrorCodes.ModelAlreadyExists,
                }),
            );
        }

        await this._teamRepository.deleteAsync(team);
        return ok(undefined);
    }
}

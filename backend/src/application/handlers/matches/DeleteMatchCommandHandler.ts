import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ITeamRepository from "application/interfaces/ITeamRepository";

type CommandProps = {
    id: string;
};

export type DeleteMatchCommandResult = ICommandResult<IApplicationError[]>;

export class DeleteMatchCommand implements ICommand<DeleteMatchCommandResult>, CommandProps {
    __returnType: DeleteMatchCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
    }

    id: string;
}

export default class DeleteMatchCommandHandler implements IRequestHandler<DeleteMatchCommand, DeleteMatchCommandResult> {
    private readonly _matchRepository: IMatchRepository;

    constructor(props: { matchRepository: IMatchRepository; teamRepository: ITeamRepository }) {
        this._matchRepository = props.matchRepository;
    }

    async handle(command: DeleteMatchCommand): Promise<DeleteMatchCommandResult> {
        const match = await this._matchRepository.getByIdAsync(command.id);
        if (match == null) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Match of id "${command.id}" does not exist.`, code: VALIDATION_ERROR_CODES.ModelDoesNotExist, path: ["_"] }));
        }

        await this._matchRepository.deleteAsync(match);
        return ok(undefined);
    }
}

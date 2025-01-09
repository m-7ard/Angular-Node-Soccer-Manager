import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import TeamExistsValidator from "application/validators/TeamExistsValidator";

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
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: TeamExistsValidator }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: DeleteTeamCommand): Promise<DeleteTeamCommandResult> {
        const teamExistsResult = await this.teamExistsValidator.validate({ id: command.id });
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        await this._teamRepository.deleteAsync(team);
        return ok(undefined);
    }
}

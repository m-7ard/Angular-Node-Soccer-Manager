import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import TeamId from "domain/valueObjects/Team/TeamId";
import ITeamValidator from "application/interfaces/ITeamValidator";
import IApplicationError from "application/errors/IApplicationError";

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
    private readonly teamExistsValidator: ITeamValidator<TeamId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId> }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: DeleteTeamCommand): Promise<DeleteTeamCommandResult> {
        const teamId = TeamId.executeCreate(command.id);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        await this._teamRepository.deleteAsync(team);
        return ok(undefined);
    }
}

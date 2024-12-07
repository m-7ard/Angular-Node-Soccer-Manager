import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

export type DeleteTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class DeleteTeamMembershipCommand implements ICommand<DeleteTeamMembershipCommandResult> {
    __returnType: DeleteTeamMembershipCommandResult = null!;

    constructor({ teamId, playerId }: { teamId: string; playerId: string }) {
        this.teamId = teamId;
        this.playerId = playerId;
    }

    public teamId: string;
    public playerId: string;
}

export default class DeleteTeamMembershipCommandHandler implements IRequestHandler<DeleteTeamMembershipCommand, DeleteTeamMembershipCommandResult> {
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { teamRepository: ITeamRepository }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(command: DeleteTeamMembershipCommand): Promise<DeleteTeamMembershipCommandResult> {
        const team = await this._teamRepository.getByIdAsync(command.teamId);
        if (team == null) {
            return err([
                {
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                    path: ["_"],
                    message: `Team with id ${command.teamId} does not exist.`,
                },
            ]);
        }

        const result = team.tryRemoveMemberByPlayerId(command.playerId);
        if (result.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors([result.error]));
        }

        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

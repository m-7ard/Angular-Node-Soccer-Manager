import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import TeamExistsValidator from "application/validators/TeamExistsValidator";
import IsTeamMemberValidator from "application/validators/_____IsTeamMemberValidator";

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
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: TeamExistsValidator; }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: DeleteTeamMembershipCommand): Promise<DeleteTeamMembershipCommandResult> {
        const teamExistsResult = await this.teamExistsValidator.validate({ id: command.teamId });
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;

        const isTeamMemberValidator = new IsTeamMemberValidator();
        const isTeamMemberResult = isTeamMemberValidator.validate({ team: teamExistsResult.value, playerId: command.playerId });
        if (isTeamMemberResult.isErr()) {
            return err(isTeamMemberResult.error);
        }

        team.executeDeleteTeamMembershipByPlayerId(command.playerId);
        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

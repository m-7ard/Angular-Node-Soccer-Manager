import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "application/interfaces/ITeamRepository";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";

export type UpdateTeamMembershipCommandResult = ICommandResult<IApplicationError[]>;

export class UpdateTeamMembershipCommand implements ICommand<UpdateTeamMembershipCommandResult> {
    __returnType: UpdateTeamMembershipCommandResult = null!;

    constructor({ teamId, playerId, activeFrom, activeTo, number }: { teamId: string; playerId: string; activeFrom: Date; activeTo: Date | null; number: number }) {
        this.teamId = teamId;
        this.playerId = playerId;
        this.activeFrom = activeFrom;
        this.activeTo = activeTo;
        this.number = number;
    }

    public teamId: string;
    public playerId: string;
    public activeFrom: Date;
    public activeTo: Date | null;
    public number: number;
}

export default class UpdateTeamMembershipCommandHandler implements IRequestHandler<UpdateTeamMembershipCommand, UpdateTeamMembershipCommandResult> {
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { teamRepository: ITeamRepository }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(command: UpdateTeamMembershipCommand): Promise<UpdateTeamMembershipCommandResult> {
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

        const result = team.tryUpdateMember(command.playerId, {
            activeFrom: command.activeFrom,
            activeTo: command.activeTo,
            number: command.number,
        });

        if (result.isErr()) {
            return err(ApplicationErrorFactory.domainErrorsToApplicationErrors([result.error]));
        }

        this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

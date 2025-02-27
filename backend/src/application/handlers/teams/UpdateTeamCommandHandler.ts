import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import TeamFactory from "domain/domainFactories/TeamFactory";
import TeamId from "domain/valueObjects/Team/TeamId";
import ITeamValidator from "application/interfaces/ITeamValidator";
import IApplicationError from "application/errors/IApplicationError";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

export type UpdateTeamCommandResult = ICommandResult<IApplicationError[]>;

export class UpdateTeamCommand implements ICommand<UpdateTeamCommandResult> {
    __returnType: UpdateTeamCommandResult = null!;

    constructor({ id, name, dateFounded }: { id: string; name: string; dateFounded: Date }) {
        this.id = id;
        this.name = name;
        this.dateFounded = dateFounded;
    }

    public id: string;
    public name: string;
    public dateFounded: Date;
}

export default class UpdateTeamCommandHandler implements IRequestHandler<UpdateTeamCommand, UpdateTeamCommandResult> {
    private readonly _teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId> }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: UpdateTeamCommand): Promise<UpdateTeamCommandResult> {
        const teamId = TeamId.executeCreate(command.id);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;
        const canUpdateDateFoundedResult = team.canUpdateDateFounded(command.dateFounded);
        if (canUpdateDateFoundedResult.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({ message: canUpdateDateFoundedResult.error, code: APPLICATION_ERROR_CODES.NotAllowed, path: [] }));
        }

        team.name = command.name;
        team.executeUpdateDateFounded(command.dateFounded);

        await this._teamRepository.updateAsync(team);
        return ok(undefined);
    }
}

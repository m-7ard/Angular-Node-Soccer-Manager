import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import TeamFactory from "domain/domainFactories/TeamFactory";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

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

    constructor(props: { teamRepository: ITeamRepository }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(command: UpdateTeamCommand): Promise<UpdateTeamCommandResult> {
        const team = await this._teamRepository.getByIdAsync(command.id);
        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Team of id "${command.id}" does not exist.`,
                    path: ["_"],
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                }),
            );
        }

        const updatedTeam = TeamFactory.CreateExisting({
            id: team.id,
            name: command.name,
            dateFounded: command.dateFounded,
            teamMemberships: team.teamMemberships
        })

        await this._teamRepository.updateAsync(updatedTeam);
        return ok(undefined);
    }
}

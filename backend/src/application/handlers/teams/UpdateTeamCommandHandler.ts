import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import TeamFactory from "domain/domainFactories/TeamFactory";
import TeamExistsValidator from "application/validators/TeamExistsValidator";

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
    private readonly teamExistsValidator: TeamExistsValidator;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: TeamExistsValidator }) {
        this._teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: UpdateTeamCommand): Promise<UpdateTeamCommandResult> {
        const teamExistsResult = await this.teamExistsValidator.validate({ id: command.id });
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team =teamExistsResult.value;

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

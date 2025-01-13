import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import TeamFactory from "domain/domainFactories/TeamFactory";
import TeamId from "domain/valueObjects/Team/TeamId";
import IApplicationError from "application/errors/IApplicationError";

export type CreateTeamCommandResult = ICommandResult<IApplicationError[]>;

export class CreateTeamCommand implements ICommand<CreateTeamCommandResult> {
    __returnType: CreateTeamCommandResult = null!;

    constructor({ id, name, dateFounded }: { id: string; name: string; dateFounded: Date }) {
        this.id = id;
        this.name = name;
        this.dateFounded = dateFounded;
    }

    public id: string;
    public name: string;
    public dateFounded: Date;
}

export default class CreateTeamCommandHandler implements IRequestHandler<CreateTeamCommand, CreateTeamCommandResult> {
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { teamRepository: ITeamRepository }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(command: CreateTeamCommand): Promise<CreateTeamCommandResult> {
        const team = TeamFactory.CreateNew({
            id: TeamId.executeCreate(command.id),
            name: command.name,
            dateFounded: command.dateFounded,
            teamMemberships: [],
        });

        await this._teamRepository.createAsync(team);
        return ok(undefined);
    }
}

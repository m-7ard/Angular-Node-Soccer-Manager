import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import ITeamRepository from "../../interfaces/ITeamRepository";
import TeamId from "domain/valueObjects/Team/TeamId";
import ITeamValidator from "application/interfaces/ITeamValidator";
import IApplicationError from "application/errors/IApplicationError";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import IMatchRepository from "application/interfaces/IMatchRepository";
import FilterAllMatchesCriteria from "infrastructure/contracts/FilterAllMatchesCriteria";
import MatchRepository from "infrastructure/repositories/MatchRepository";

export type DeleteTeamCommandResult = ICommandResult<IApplicationError[]>;

export class DeleteTeamCommand implements ICommand<DeleteTeamCommandResult> {
    __returnType: DeleteTeamCommandResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class DeleteTeamCommandHandler implements IRequestHandler<DeleteTeamCommand, DeleteTeamCommandResult> {
    private readonly teamRepository: ITeamRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;
    private readonly matchRepository: IMatchRepository;

    constructor(props: { teamRepository: ITeamRepository; teamExistsValidator: ITeamValidator<TeamId>; matchRepository: IMatchRepository }) {
        this.teamRepository = props.teamRepository;
        this.teamExistsValidator = props.teamExistsValidator;
        this.matchRepository = props.matchRepository;
    }

    async handle(command: DeleteTeamCommand): Promise<DeleteTeamCommandResult> {
        const teamId = TeamId.executeCreate(command.id);
        const teamExistsResult = await this.teamExistsValidator.validate(teamId);
        if (teamExistsResult.isErr()) {
            return err(teamExistsResult.error);
        }

        const team = teamExistsResult.value;
        if (team.teamMemberships.length) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Cannot delete team while it has memberships.`, code: APPLICATION_ERROR_CODES.NotAllowed, path: [] }));
        }

        const criteria = new FilterAllMatchesCriteria({
            limitBy: null,
            scheduledDate: null,
            status: null,
            teamId: team.id.value,
        });
        const matches = await this.matchRepository.filterAllAsync(criteria);
        if (matches.length) {
            return err(
                ApplicationErrorFactory.createSingleListError({ message: `Cannot delete team while it has references to existing matches.`, code: APPLICATION_ERROR_CODES.NotAllowed, path: [] }),
            );
        }

        await this.teamRepository.deleteAsync(team);
        return ok(undefined);
    }
}

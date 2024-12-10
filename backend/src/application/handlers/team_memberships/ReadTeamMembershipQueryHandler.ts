import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import Team from "../../../domain/entities/Team";
import ITeamRepository from "../../interfaces/ITeamRepository";
import { err, ok } from "neverthrow";
import VALIDATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import TeamMembership from "domain/entities/TeamMembership";

export type ReadTeamMembershipQueryResult = IQueryResult<{ team: Team; teamMembership: TeamMembership }, IApplicationError[]>;

export class ReadTeamMembershipQuery implements IQuery<ReadTeamMembershipQueryResult> {
    __returnType: ReadTeamMembershipQueryResult = null!;

    constructor({ teamId, playerId }: { teamId: string; playerId: string }) {
        this.teamId = teamId;
        this.playerId = playerId;
    }

    public teamId: string;
    public playerId: string;
}

export default class ReadTeamMembershipQueryHandler implements IRequestHandler<ReadTeamMembershipQuery, ReadTeamMembershipQueryResult> {
    private readonly _teamRepository: ITeamRepository;

    constructor(props: { teamRepository: ITeamRepository }) {
        this._teamRepository = props.teamRepository;
    }

    async handle(command: ReadTeamMembershipQuery): Promise<ReadTeamMembershipQueryResult> {
        const team = await this._teamRepository.getByIdAsync(command.teamId);
        if (team == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                    path: ["_"],
                    message: `Team of id "${command.teamId}" does not exist.`,
                }),
            );
        }

        const teamMembership = team.findMemberByPlayerId(command.playerId);
        if (teamMembership == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    code: VALIDATION_ERROR_CODES.ModelDoesNotExist,
                    path: ["_"],
                    message: `Player of id "${command.playerId}" does not exist in memberships of team "${command.teamId}".`,
                }),
            );
        }

        return ok({
            team: team,
            teamMembership: teamMembership,
        });
    }
}

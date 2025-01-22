import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import Player from "domain/entities/Player";
import IPlayerValidator from "application/interfaces/IPlayerValidaror";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import IApplicationError from "application/errors/IApplicationError";
import Team from "domain/entities/Team";
import ITeamRepository from "application/interfaces/ITeamRepository";
import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";

export type ReadFullPlayerQueryResult = IQueryResult<
    {
        player: Player;
        currentTeams: Team[];
        formerTeams: Team[];
    },
    IApplicationError[]
>;

export class ReadFullPlayerQuery implements IQuery<ReadFullPlayerQueryResult> {
    __returnType: ReadFullPlayerQueryResult = null!;

    constructor({ id }: { id: string }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadFullPlayerQueryHandler implements IRequestHandler<ReadFullPlayerQuery, ReadFullPlayerQueryResult> {
    private readonly playerExistsValidator: IPlayerValidator<PlayerId>;
    private readonly teamRepository: ITeamRepository;

    constructor(props: { playerExistsValidator: IPlayerValidator<PlayerId>; teamRepository: ITeamRepository }) {
        this.playerExistsValidator = props.playerExistsValidator;
        this.teamRepository = props.teamRepository;
    }

    async handle(query: ReadFullPlayerQuery): Promise<ReadFullPlayerQueryResult> {
        const playerExistsResult = await this.playerExistsValidator.validate(PlayerId.executeCreate(query.id));
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const player = playerExistsResult.value;

        const criteria = new FilterAllTeamsCriteria({ limitBy: null, name: null, teamMembershipPlayerId: player.id });
        const teams = await this.teamRepository.filterAllAsync(criteria);
        const currentTeams: Team[] = [];
        const formerTeams: Team[] = [];

        teams.forEach((team) => {
            if (team.findActiveMemberByPlayerId(player.id) == null) {
                formerTeams.push(team);
            } else {
                currentTeams.push(team);
            }
        });

        return ok({
            player: player,
            currentTeams: currentTeams,
            formerTeams: formerTeams,
        });
    }
}

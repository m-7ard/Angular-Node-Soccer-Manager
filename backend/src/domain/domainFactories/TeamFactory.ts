import TeamMembership from "domain/entities/TeamMembership";
import Team from "../entities/Team";

class TeamFactory {
    static CreateNew({ id, name, dateFounded, teamMemberships }: { id: string; name: string; dateFounded: Date; teamMemberships: TeamMembership[] }) {
        return new Team({
            id: id,
            name: name,
            dateFounded: dateFounded,
            teamMemberships: teamMemberships
        });
    }

    static CreateExisting({ id, name, dateFounded, teamMemberships }: { id: string; name: string; dateFounded: Date; teamMemberships: TeamMembership[] }) {
        return new Team({
            id: id,
            name: name,
            dateFounded: dateFounded,
            teamMemberships: teamMemberships
        });
    }
}

export default TeamFactory;

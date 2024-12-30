export default interface ITeamMembershipSchema {
    id: string;
    team_id: string;
    player_id: string;
    active_from: Date;
    active_to: Date | null;
    number: number;
}

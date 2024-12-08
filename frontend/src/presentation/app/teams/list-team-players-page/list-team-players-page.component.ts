import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import TeamPlayer from '../../../models/TeamPlayer';
import { IListTeamPlayersResolverData } from './list-team-players-page.resolver';
import Team from '../../../models/Team';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import { CommonModule } from '@angular/common';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { ListTeamPlayerPageTeamPlayerElementComponent } from './list-team-players-page-team-player-element/list-team-players-page-team-player-element.component';

@Component({
    selector: 'app-list-team-players-page',
    standalone: true,
    imports: [MixinButtonComponent, CommonModule, ListTeamPlayerPageTeamPlayerElementComponent],
    templateUrl: './list-team-players-page.component.html',
})
export class ListTeamPlayersPageComponent {
    constructor(private _activatedRoute: ActivatedRoute) {}

    teamPlayers: TeamPlayer[] = null!;
    team: Team = null!;

    onDeleteTeamPlayer(teamPlayer: TeamPlayer) {
        this.teamPlayers = this.teamPlayers.filter((value) => value.membership.id !== teamPlayer.membership.id);
    }

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData['data'] as IListTeamPlayersResolverData;
            this.teamPlayers = data.teamPlayers;
            this.team = data.team;
        });
    }
}

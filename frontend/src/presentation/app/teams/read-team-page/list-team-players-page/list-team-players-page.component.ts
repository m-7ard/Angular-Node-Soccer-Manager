import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import TeamPlayer from '../../../../models/TeamPlayer';
import Team from '../../../../models/Team';
import { CommonModule } from '@angular/common';
import { ListTeamPlayerPageTeamPlayerElementComponent } from './list-team-players-page-team-player-element/list-team-players-page-team-player-element.component';
import { ITeamLayoutPageResolverData } from '../team-layout-page.resolver';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { ContentDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';

@Component({
    selector: 'app-list-team-players-page',
    standalone: true,
    imports: [
        CommonModule,
        ListTeamPlayerPageTeamPlayerElementComponent,
        RouterModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PageDirectivesModule,
        ContentDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './list-team-players-page.component.html',
})
export class ListTeamPlayersPageComponent {
    team!: Team;
    teamPlayers!: TeamPlayer[];
    
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.parent!.data['RESOLVER_DATA'];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;
    }

    onDeleteTeamPlayer(teamPlayer: TeamPlayer) {
        this.teamPlayers = this.teamPlayers.filter((value) => value.membership.id !== teamPlayer.membership.id);
    }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Team from '../../../../models/Team';
import TeamPlayer from '../../../../models/TeamPlayer';
import { IReadTeamResolverData } from '../read-team-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinButtonDirective } from '../../../../ui-mixins/mixin-button-directive/mixin-button.directive';
import { MixinStyledCardSectionDirective } from '../../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';

@Component({
    selector: 'app-team-home-page',
    standalone: true,
    imports: [
        CommonModule,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
        RouterModule,
        CoverImageComponent,
        ZeebraTextComponent,
        MixinButtonDirective,
        MixinStyledButtonDirective
    ],
    templateUrl: './team-home-page.component.html',
})
export class TeamHomePageComponent {
    team!: Team;
    teamPlayers!: TeamPlayer[];

    get activePlayers() {
        return this.teamPlayers.filter((teamPlayer) => teamPlayer.isActive());
    }

    constructor(private _activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: IReadTeamResolverData = this._activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;
    }
}

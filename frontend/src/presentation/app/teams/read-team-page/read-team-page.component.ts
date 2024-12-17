import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Team from '../../../models/Team';
import TeamPlayer from '../../../models/TeamPlayer';
import { IReadTeamResolverData } from './read-team-page.resolver';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledButtonDirective } from '../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';
import { ZeebraTextComponent } from '../../../reusables/zeebra-text/zeebra-text.component';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';

@Component({
    selector: 'app-read-team-page',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
        CoverImageComponent,
        MixinStyledButtonDirective,
        ZeebraTextComponent,
    ],
    templateUrl: './read-team-page.component.html',
})
export class ReadTeamPageComponent implements OnInit {
    team!: Team;
    teamPlayers!: TeamPlayer[];

    constructor(private _activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: IReadTeamResolverData = this._activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;
    }
}

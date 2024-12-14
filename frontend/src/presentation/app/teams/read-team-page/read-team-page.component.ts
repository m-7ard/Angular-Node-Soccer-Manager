import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Team from '../../../models/Team';
import TeamPlayer from '../../../models/TeamPlayer';
import { IReadTeamResolverData } from './read-team-page.resolver';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { MixinButtonDirective } from '../../../ui-mixins/mixin-button-directive/mixin-button.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledButtonDirective } from '../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';

@Component({
    selector: 'app-read-team-page',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
        CoverImageComponent,
        MixinStyledButtonDirective
    ],
    templateUrl: './read-team-page.component.html',
})
export class ReadTeamPageComponent implements OnInit {
    team!: Team;
    teamPlayers!: TeamPlayer[];

    constructor(
        private router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        const data: IReadTeamResolverData = this._activatedRoute.snapshot.data['RESOLVER_DATA'];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Team from '../../../models/Team';
import TeamPlayer from '../../../models/TeamPlayer';
import { IReadTeamResolverData } from './read-team-page.resolver';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { ZeebraTextComponent } from '../../../reusables/zeebra-text/zeebra-text.component';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';
import { DividerComponent } from "../../../reusables/divider/divider.component";
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';

@Component({
    selector: 'app-read-team-page',
    standalone: true,
    imports: [
    RouterModule,
    MixinStyledCardDirectivesModule,
    CoverImageComponent,
    MixinStyledButtonDirective,
    ZeebraTextComponent,
    ContentGridDirective,
    ContentGridTrackDirective,
    DividerComponent,
    PageDirectivesModule
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

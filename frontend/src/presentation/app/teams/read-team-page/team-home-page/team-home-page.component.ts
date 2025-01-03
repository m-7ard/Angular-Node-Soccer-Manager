import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Team from '../../../../models/Team';
import TeamPlayer from '../../../../models/TeamPlayer';
import { IReadTeamResolverData } from '../read-team-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { ContentGridDirective } from '../../../../reusables/content-grid/content-grid.directive';
import { ContentGridTrackDirective } from '../../../../reusables/content-grid/content-grid-track.directive';
import { DividerComponent } from "../../../../reusables/divider/divider.component";

@Component({
    selector: 'app-team-home-page',
    standalone: true,
    imports: [
    CommonModule,
    MixinStyledCardDirectivesModule,
    RouterModule,
    CoverImageComponent,
    ZeebraTextComponent,
    MixinStyledButtonDirective,
    PageDirectivesModule,
    ContentGridDirective,
    ContentGridTrackDirective,
    DividerComponent
],
    templateUrl: './team-home-page.component.html',
})
export class TeamHomePageComponent {
    team!: Team;
    teamPlayers!: TeamPlayer[];
    public matchesRange = Array.from({ length: 1 }, (_, i) => i + 1);

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

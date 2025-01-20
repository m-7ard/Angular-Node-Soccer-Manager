import { Component, OnInit } from '@angular/core';
import { ITeamPlayerLayoutPageResolverData } from '../team-player-layout.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ActivatedRoute, RouterModule } from '@angular/router';
import TeamPlayer from '../../../../models/TeamPlayer';
import { CommonModule } from '@angular/common';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { MatchElementComponent } from '../../../../reusables/model-elements/match-element/match-element.component';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { TeamMembershipHistoryElement } from '../../../../reusables/model-elements/team-membership-history-element/team-membership-history-element.component';

@Component({
    selector: 'app-team-player-details-page',
    standalone: true,
    imports: [
    CommonModule,
    MixinStyledCardDirectivesModule,
    RouterModule,
    PageDirectivesModule,
    DividerComponent,
    ContentGridDirectivesModule,
    TeamMembershipHistoryElement,
    CoverImageComponent
],
    templateUrl: './team-player-details-page.component.html',
})
export class TeamPlayerDetailsPageComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    teamPlayer!: TeamPlayer;

    ngOnInit(): void {
        const data: ITeamPlayerLayoutPageResolverData = this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.teamPlayer = data.teamPlayer;
    }
}

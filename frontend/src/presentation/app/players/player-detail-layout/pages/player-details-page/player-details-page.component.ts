import { Component } from '@angular/core';
import { IPlayerDetailsPageResolverData } from './player-details-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import Team from '../../../../../models/Team';
import { IPlayerDetailLayoutResolverData } from '../../player-detail-layout.resolver';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Player from '../../../../../models/Player';
import { CommonModule } from '@angular/common';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { TeamMembershipHistoryElement } from '../../../../../reusables/model-elements/team-membership-history-element/team-membership-history-element.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { TeamElementComponent } from '../../../../../reusables/model-elements/team-element/team-element.component';

@Component({
    selector: 'app-player-details-page',
    standalone: true,
    imports: [
        CommonModule,
        MixinStyledCardDirectivesModule,
        RouterModule,
        PageDirectivesModule,
        DividerComponent,
        ContentGridDirectivesModule,
        TeamMembershipHistoryElement,
        TeamElementComponent,
    ],
    templateUrl: './player-details-page.component.html',
})
export class PlayerDetailsPageComponent {
    currentTeams!: Team[];
    formerTeams!: Team[];
    player!: Player;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: IPlayerDetailsPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.currentTeams = data.currentTeams;
        this.formerTeams = data.formerTeams;

        const parentData: IPlayerDetailLayoutResolverData =
            this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.player = parentData.player;
    }
}

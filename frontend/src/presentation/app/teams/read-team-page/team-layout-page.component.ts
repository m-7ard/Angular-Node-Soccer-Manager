import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Team from '../../../models/Team';
import TeamPlayer from '../../../models/TeamPlayer';
import { ITeamLayoutPageResolverData } from './team-layout-page.resolver';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { ContentDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';

@Component({
    selector: 'app-read-team-page',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirectivesModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        ContentDirectivesModule,
        DividerComponent,
        PageDirectivesModule,
    ],
    templateUrl: './team-layout-page.component.html',
})
export class TeamLayoutPageComponent implements OnInit {
    team!: Team;
    teamPlayers!: TeamPlayer[];

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;
    }
}

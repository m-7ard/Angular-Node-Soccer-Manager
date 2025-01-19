import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import Match from '../../../models/Match';
import MatchEvent from '../../../models/MatchEvent';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { IMatchPageLayoutResolverData } from './match-page-layout.resolver';
import { CommonModule } from '@angular/common';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { MatchStatusSingleton } from '../../../services/match-status-singleton.service';

@Component({
    selector: 'app-match-page-layout',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirectivesModule,
        CoverImageComponent,
        ContentGridDirectivesModule,
        DividerComponent,
        PageDirectivesModule,
        CommonModule,
        MixinStyledButtonDirective
    ],
    templateUrl: './match-page-layout.component.html',
})
export class MatchPageLayoutComponent implements OnInit {
    match!: Match;
    matchEvents!: MatchEvent[];

    constructor(private activatedRoute: ActivatedRoute, readonly matchStatusService: MatchStatusSingleton) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(data => {
            const resolverData: IMatchPageLayoutResolverData = data[RESOLVER_DATA_KEY];
            this.match = resolverData.match;
            this.matchEvents = resolverData.matchEvents;
        });
    }
}

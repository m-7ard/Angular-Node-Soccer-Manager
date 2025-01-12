import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentGridTrackDirective } from '../../../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../../../reusables/content-grid/content-grid.directive';
import { CoverImageComponent } from '../../../../../reusables/cover-image/cover-image.component';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { ZeebraTextComponent } from '../../../../../reusables/zeebra-text/zeebra-text.component';
import Match from '../../../../../models/Match';
import MatchEvent from '../../../../../models/MatchEvent';
import { IMatchPageLayoutResolverData } from '../../match-page-layout.resolver';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';

@Component({
  selector: 'app-match-details-page',
  standalone: true,
  imports: [
        CommonModule,
        MixinStyledCardDirectivesModule,
        RouterModule,
        CoverImageComponent,
        ZeebraTextComponent,
        MixinStyledButtonDirective,
        PageDirectivesModule,
        DividerComponent
  ],
  templateUrl: './match-details-page.component.html',
})
export class MatchDetailsPageComponent {
    match!: Match;
    matchEvents!: MatchEvent[];

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: IMatchPageLayoutResolverData = this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.match = data.match;
        this.matchEvents = data.matchEvents;
    }
}

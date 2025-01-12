import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MixinStyledButtonDirective } from '../../reusables/styled-button/styled-button.directive';
import { CoverImageComponent } from '../../reusables/cover-image/cover-image.component';
import { ZeebraTextComponent } from '../../reusables/zeebra-text/zeebra-text.component';
import { IFrontpageResolverData } from './frontpage.resolver';
import Player from '../../models/Player';
import Team from '../../models/Team';
import { RESOLVER_DATA_KEY } from '../../utils/RESOLVER_DATA';
import { ContentGridTrackDirective } from '../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../reusables/content-grid/content-grid.directive';
import { DividerComponent } from '../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../reusables/styled-card/styled-card.module';
import Match from '../../models/Match';

@Component({
    selector: 'app-frontpage',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        CoverImageComponent,
        ZeebraTextComponent,
        PageDirectivesModule,
        ContentGridDirective,
        ContentGridTrackDirective,
        DividerComponent
    ],
    templateUrl: './frontpage.component.html',
})
export class FrontpageComponent implements OnInit {
    public players: Player[] = null!;
    public teams: Team[] = null!;
    public matches: Match[] = null!;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IFrontpageResolverData;
            this.players = data.players;
            this.teams = data.teams;
            this.matches = data.matches;
        });
    }
}

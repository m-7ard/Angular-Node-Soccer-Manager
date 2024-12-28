import { Component, OnInit } from '@angular/core';
import { ListPlayersPagePlayerElementComponent } from '../players/list-players-page/list-players-page-player-element/list-players-page-player-element.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MixinStyledCardSectionDirective } from '../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../reusables/styled-button/styled-button.directive';
import { CoverImageComponent } from '../../reusables/cover-image/cover-image.component';
import { ZeebraTextComponent } from '../../reusables/zeebra-text/zeebra-text.component';
import { IFrontpageResolverData } from './frontpage.resolver';
import Player from '../../models/Player';
import Team from '../../models/Team';
import { RESOLVER_DATA_KEY } from '../../utils/RESOLVER_DATA';
import { ContentGridTrackDirective } from '../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../reusables/content-grid/page.directive';
import { PageSectionDirective } from '../../reusables/page/page-section.directive';
import { PageDirective } from '../../reusables/page/page.directive';

@Component({
    selector: 'app-frontpage',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
        CoverImageComponent,
        ZeebraTextComponent,
        PageDirective,
        PageSectionDirective,
        ContentGridDirective,
        ContentGridTrackDirective,
    ],
    templateUrl: './frontpage.component.html',
})
export class FrontpageComponent implements OnInit {
    public players: Player[] = null!;
    public teams: Team[] = null!;
    public matchesRange = Array.from({ length: 10 }, (_, i) => i + 1);

    constructor(private _activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IFrontpageResolverData;
            this.players = data.players;
            this.teams = data.teams;
        });
    }
}

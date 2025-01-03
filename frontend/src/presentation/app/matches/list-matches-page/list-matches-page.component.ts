import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { PanelDirectivesModule } from '../../../reusables/panel/panel.directive.module';
import { PrimeNgPopoverDirective } from '../../../reusables/prime-ng-popover/prime-ng-popover.directive';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { IListMatchesResolverData } from './list-matches-page.resolver';
import Match from '../../../models/Match';
import { ListMatchsPageMatchElementComponent } from './list-matches-page-team-element/list-matches-page-match-element.component';

@Component({
    selector: 'app-list-matches-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PrimeNgPopoverDirective,
        PageDirectivesModule,
        MatMenuModule,
        PanelDirectivesModule,
        DividerComponent,
        PopoverModule,
        ContentGridDirective,
        ContentGridTrackDirective,
        ListMatchsPageMatchElementComponent,
    ],
    templateUrl: './list-matches-page.component.html',
})
export class ListMatchesPageComponent {
    constructor(private _activatedRoute: ActivatedRoute) {}

    matches: Match[] = null!;

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IListMatchesResolverData;
            this.matches = data.matches;
        });
    }
}

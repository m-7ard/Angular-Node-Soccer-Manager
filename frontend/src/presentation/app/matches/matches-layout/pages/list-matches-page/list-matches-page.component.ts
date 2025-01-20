import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { PanelDirectivesModule } from '../../../../../reusables/panel/panel.directive.module';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import { IListMatchesResolverData } from './list-matches-page.resolver';
import Match from '../../../../../models/Match';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';
import { CoverImageComponent } from '../../../../../reusables/cover-image/cover-image.component';
import { MatchElementComponent } from '../../../../../reusables/model-elements/match-element/match-element.component';

@Component({
    selector: 'app-list-matches-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PageDirectivesModule,
        MatMenuModule,
        PanelDirectivesModule,
        DividerComponent,
        PopoverModule,
        ContentGridDirectivesModule,
        CoverImageComponent,
        MatchElementComponent,
    ],
    templateUrl: './list-matches-page.component.html',
})
export class ListMatchesPageComponent {
    constructor(private activatedRoute: ActivatedRoute) {}

    public matches: Match[] = null!;
    public matchesDate = new Date();

    onDeleteMatch(match: Match) {
        this.matches = this.matches.filter((value) => value.id !== match.id);
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IListMatchesResolverData;
            this.matches = data.matches;
        });
    }
}

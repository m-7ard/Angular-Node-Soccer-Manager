import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import Match from '../../../models/Match';
import MatchEvent from '../../../models/MatchEvent';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { IMatchPageLayoutResolverData } from './match-page-layout.resolver';
import { CommonModule } from '@angular/common';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { FormFieldComponent, HeaderNavbarButtons } from '../../../reusables/header-navbar/header-navbar.component';
import MatchStatus from '../../../values/MatchStatus';

@Component({
    selector: 'app-match-page-layout',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        PageDirectivesModule,
        CommonModule,
        FormFieldComponent,
    ],
    templateUrl: './match-page-layout.component.html',
})
export class MatchPageLayoutComponent implements OnInit {
    match!: Match;
    matchEvents!: MatchEvent[];

    buttons!: HeaderNavbarButtons;

    constructor(
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe((data) => {
            const resolverData: IMatchPageLayoutResolverData = data[RESOLVER_DATA_KEY];
            this.match = resolverData.match;
            this.matchEvents = resolverData.matchEvents;

            this.buttons = [
                { label: 'Details', url: `/matches/${this.match.id}` },
                { label: 'Delete', url: `/matches/${this.match.id}/delete` },
            ];

            if (this.match.status.isScorable) {
                this.buttons.push({ label: 'Record Goal', url: `/matches/${this.match.id}/record-goal` });
            }

            if (this.match.status === MatchStatus.SCHEDULED) {
                this.buttons.push({ label: 'Mark In Progress', url: `/matches/${this.match.id}/mark-in-progress` });
            }

            if (this.match.status === MatchStatus.IN_PROGRESS) {
                this.buttons.push({ label: 'Mark Completed', url: `/matches/${this.match.id}/mark-completed` });
            }

            if (this.match.status !== MatchStatus.CANCELLED) {
                this.buttons.push({ label: 'Mark Cancelled', url: `/matches/${this.match.id}/mark-cancelled` });
            }
        });
    }
}

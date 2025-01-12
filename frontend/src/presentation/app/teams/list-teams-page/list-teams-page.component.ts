import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IListTeamsResolverData } from './list-teams-page.resolver';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Team from '../../../models/Team';
import { ListTeamsPageTeamElementComponent } from './list-teams-page-team-element/list-teams-page-team-element.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { MatMenuModule } from '@angular/material/menu';
import { PopoverModule } from 'primeng/popover';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PanelDirectivesModule } from '../../../reusables/panel/panel.directive.module';
import { PrimeNgPopoverDirective } from '../../../reusables/prime-ng-popover/prime-ng-popover.directive';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';

@Component({
    selector: 'app-list-teams-page',
    standalone: true,
    imports: [
        CommonModule,
        ListTeamsPageTeamElementComponent,
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
    ],
    templateUrl: './list-teams-page.component.html',
})
export class ListTeamsPageComponent {
    constructor(private activatedRoute: ActivatedRoute) {}

    teams: Team[] = null!;

    onDeleteTeam(team: Team) {
        this.teams = this.teams.filter((value) => value.id !== team.id);
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IListTeamsResolverData;
            this.teams = data.teams;
        });
    }
}

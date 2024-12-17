import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IListTeamsResolverData } from './list-teams-page.resolver';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Team from '../../../models/Team';
import { ListTeamsPageTeamElementComponent } from './list-teams-page-team-element/list-teams-page-team-element.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';

@Component({
    selector: 'app-list-teams-page',
    standalone: true,
    imports: [CommonModule, ListTeamsPageTeamElementComponent, RouterModule, MixinStyledButtonDirective, MixinStyledCardDirective, MixinStyledCardSectionDirective],
    templateUrl: './list-teams-page.component.html',
})
export class ListTeamsPageComponent {
    constructor(private _activatedRoute: ActivatedRoute) {}

    teams: Team[] = null!;

    onDeleteTeam(team: Team) {
        this.teams = this.teams.filter((value) => value.id !== team.id);
    }

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IListTeamsResolverData;
            this.teams = data.teams;
        });
    }
}

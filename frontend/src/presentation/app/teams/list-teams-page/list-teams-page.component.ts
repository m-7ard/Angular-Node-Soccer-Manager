import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IListTeamsResolverData } from './list-teams-page.resolver';
import { ActivatedRoute } from '@angular/router';
import Team from '../../../models/Team';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import { ListTeamsPageTeamElementComponent } from "./list-teams-page-team-element/list-teams-page-team-element.component";

@Component({
    selector: 'app-list-teams-page',
    standalone: true,
    imports: [
    CommonModule,
    MixinButtonComponent,
    ListTeamsPageTeamElementComponent
],
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
            const data = resolverData as IListTeamsResolverData;
            this.teams = data.teams;
        });
    }
}

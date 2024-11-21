import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IListTeamsResolverData } from './list-teams-page.resolver';
import { ActivatedRoute } from '@angular/router';
import Team from '../../../models/Team';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';

@Component({
    selector: 'app-list-teams-page',
    standalone: true,
    imports: [
        CommonModule,
        CoverImageComponent,
        MixinButtonComponent,
    ],
    templateUrl: './list-teams-page.component.html',
})
export class ListTeamsPageComponent {
    constructor(private _activatedRoute: ActivatedRoute) {}

    teams: Team[] = null!;

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData as IListTeamsResolverData;
            this.teams = data.teams;
        });
    }
}

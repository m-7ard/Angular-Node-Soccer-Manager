import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { MixinPrototypeCardComponent } from '../../../ui-mixins/mixin-prototype-card/mixin-prototype-card.component';
import { MixinPrototypeCardSectionComponent } from '../../../ui-mixins/mixin-prototype-card/mixin-prototype-card-section/mixin-prototype-card-section.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import Player from '../../../models/Player';

@Component({
    selector: 'app-list-players-page',
    standalone: true,
    imports: [
        CommonModule,
        MixinPrototypeCardComponent,
        MixinPrototypeCardSectionComponent,
        CoverImageComponent,
        MixinButtonComponent,
    ],
    templateUrl: './list-players-page.component.html',
})
export class ListPlayersPageComponent {
    constructor(private _activatedRoute: ActivatedRoute) {}

    players: Player[] = null!;

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            this.players = resolverData['players'];
        });
    }
}

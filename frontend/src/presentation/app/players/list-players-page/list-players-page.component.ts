import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Player from '../../../models/Player';
import { IListPlayersResolverData } from './list-players-page.resolver';
import { ListPlayersPagePlayerElementComponent } from './list-players-page-player-element/list-players-page-player-element.component';
import { MixinStyledButtonDirective } from '../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';

@Component({
    selector: 'app-list-players-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
        ListPlayersPagePlayerElementComponent,
    ],
    templateUrl: './list-players-page.component.html',
})
export class ListPlayersPageComponent {
    constructor(private _activatedRoute: ActivatedRoute) {}

    players: Player[] = null!;

    onDeletePlayer(players: Player) {
        this.players = this.players.filter((value) => value.id !== players.id);
    }

    ngOnInit() {
        this._activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IListPlayersResolverData;
            this.players = data.players;
        });
    }
}

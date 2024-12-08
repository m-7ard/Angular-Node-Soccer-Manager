import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import Player from '../../../models/Player';
import { IListPlayersResolverData } from './list-players-page.resolver';
import { ListPlayersPagePlayerElementComponent } from "./list-players-page-player-element/list-players-page-player-element.component";

@Component({
    selector: 'app-list-players-page',
    standalone: true,
    imports: [
    CommonModule,
    CoverImageComponent,
    MixinButtonComponent,
    ListPlayersPagePlayerElementComponent
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
            const data = resolverData as IListPlayersResolverData;
            this.players = data.players;
        });
    }
}

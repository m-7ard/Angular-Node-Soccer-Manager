import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Player from '../../../models/Player';
import { IListPlayersResolverData } from './list-players-page.resolver';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { PlayerElementComponent } from "../../../reusables/model-elements/player-element/player-element.component";

@Component({
    selector: 'app-list-players-page',
    standalone: true,
    imports: [
    CommonModule,
    RouterModule,
    MixinStyledButtonDirective,
    PageDirectivesModule,
    ContentGridDirectivesModule,
    DividerComponent,
    PlayerElementComponent
],
    templateUrl: './list-players-page.component.html',
})
export class ListPlayersPageComponent {
    constructor(private activatedRoute: ActivatedRoute) {}

    players: Player[] = null!;

    onDeletePlayer(players: Player) {
        this.players = this.players.filter((value) => value.id !== players.id);
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IListPlayersResolverData;
            this.players = data.players;
        });
    }
}

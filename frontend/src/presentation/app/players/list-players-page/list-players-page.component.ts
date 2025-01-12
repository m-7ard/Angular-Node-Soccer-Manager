import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Player from '../../../models/Player';
import { IListPlayersResolverData } from './list-players-page.resolver';
import { ListPlayersPagePlayerElementComponent } from './list-players-page-player-element/list-players-page-player-element.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { ContentDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';

@Component({
    selector: 'app-list-players-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledButtonDirective,
        ListPlayersPagePlayerElementComponent,
        PageDirectivesModule,
        ContentDirectivesModule,
        DividerComponent,
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

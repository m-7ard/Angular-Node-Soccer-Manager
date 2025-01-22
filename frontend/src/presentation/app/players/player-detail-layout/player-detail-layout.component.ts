import { Component } from '@angular/core';
import Player from '../../../models/Player';
import { IPlayerDetailLayoutResolverData } from './player-detail-layout.resolver';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';

@Component({
    selector: 'app-player-detail-layout',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        PageDirectivesModule,
    ],
    templateUrl: './player-detail-layout.component.html',
})
export class PlayerDetailLayoutComponent {
    player!: Player;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: IPlayerDetailLayoutResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.player = data.player;
    }
}

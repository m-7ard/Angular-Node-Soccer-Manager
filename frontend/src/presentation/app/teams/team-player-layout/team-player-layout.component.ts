import { ActivatedRoute, RouterModule } from "@angular/router";
import { ITeamPlayerLayoutPageResolverData } from "./team-player-layout.resolver";
import { Component, OnInit } from "@angular/core";
import Team from "../../../models/Team";
import TeamPlayer from "../../../models/TeamPlayer";
import { ContentGridDirectivesModule } from "../../../reusables/content-grid/content-grid.directive.module";
import { CoverImageComponent } from "../../../reusables/cover-image/cover-image.component";
import { DividerComponent } from "../../../reusables/divider/divider.component";
import { PageDirectivesModule } from "../../../reusables/page/page.directive.module";
import { MixinStyledButtonDirective } from "../../../reusables/styled-button/styled-button.directive";
import { MixinStyledCardDirectivesModule } from "../../../reusables/styled-card/styled-card.module";
import { RESOLVER_DATA_KEY } from "../../../utils/RESOLVER_DATA";

@Component({
    selector: 'app-team-player-layout',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirectivesModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        ContentGridDirectivesModule,
        DividerComponent,
        PageDirectivesModule,
    ],
    templateUrl: './team-player-layout.component.html',
})
export class TeamPlayerLayoutComponent implements OnInit {
    team!: Team;
    teamPlayer!: TeamPlayer;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamPlayerLayoutPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayer = data.teamPlayer;
    }
}

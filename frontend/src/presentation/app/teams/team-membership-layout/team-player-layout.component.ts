import { ActivatedRoute, RouterModule } from "@angular/router";
import { ITeamPlayerLayoutPageResolverData } from "./team-player-layout.resolver";
import { Component, OnInit } from "@angular/core";
import Team from "../../../models/Team";
import TeamPlayer from "../../../models/TeamPlayer";
import { ContentGridDirectivesModule } from "../../../reusables/content-grid/content-grid.directive.module";
import { DividerComponent } from "../../../reusables/divider/divider.component";
import { PageDirectivesModule } from "../../../reusables/page/page.directive.module";
import { MixinStyledCardDirectivesModule } from "../../../reusables/styled-card/styled-card.module";
import { RESOLVER_DATA_KEY } from "../../../utils/RESOLVER_DATA";
import { FormFieldComponent, HeaderNavbarButtons } from "../../../reusables/header-navbar/header-navbar.component";

@Component({
    selector: 'app-team-player-layout',
    standalone: true,
    imports: [
    RouterModule,
    MixinStyledCardDirectivesModule,
    ContentGridDirectivesModule,
    DividerComponent,
    PageDirectivesModule,
    FormFieldComponent
],
    templateUrl: './team-player-layout.component.html',
})
export class TeamPlayerLayoutComponent implements OnInit {
    public buttons!: HeaderNavbarButtons;

    team!: Team;
    teamPlayer!: TeamPlayer;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamPlayerLayoutPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayer = data.teamPlayer;

        this.buttons = [
            { label: "Details", url: `/teams/${this.team.id}/memberships/${this.teamPlayer.membership.id}` },
            { label: "Membership Histories", url: `/teams/${this.team.id}/memberships/${this.teamPlayer.membership.id}/histories` },
            { label: "Update", url: `/teams/${this.team.id}/memberships/${this.teamPlayer.membership.id}/update` },
            { label: "Create Membership History", url: `/teams/${this.team.id}/memberships/${this.teamPlayer.membership.id}/create` },
        ]
    }
}

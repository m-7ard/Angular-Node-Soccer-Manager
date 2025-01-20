import { ActivatedRoute, RouterModule } from '@angular/router';
import { ITeamMembershipHistoryLayoutResolverData } from './team-membership-history-layout.resolver';
import { Component, OnInit } from '@angular/core';
import Team from '../../../models/Team';
import TeamPlayer from '../../../models/TeamPlayer';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { CoverImageComponent } from '../../../reusables/cover-image/cover-image.component';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { FormFieldComponent, HeaderNavbarProps } from '../../../reusables/header-navbar/header-navbar.component';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirectivesModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        ContentGridDirectivesModule,
        DividerComponent,
        PageDirectivesModule,
        FormFieldComponent,
    ],
    templateUrl: './team-membership-history-layout.component.html',
})
export class TeamMembershipHistoryLayoutComponent implements OnInit {
    team!: Team;
    teamPlayer!: TeamPlayer;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamMembershipHistoryLayoutResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayer = data.teamPlayer;

        this.navbarProps = [
            {
                url: `/teams/${this.team.id}/memberships/${this.teamPlayer.membership.id}`,
                label: 'Details',
            },
            {
                url: `/teams/${this.team.id}/memberships/${this.teamPlayer.membership.id}/histories`,
                label: 'Membership Histories',
            },
            {
                url: `/teams/${this.team.id}/memberships/${this.teamPlayer.membership.id}/update`,
                label: 'Update',
            },
            {
                url: `/teams/${this.team.id}/${this.teamPlayer.membership.id}/memberships/histories/create`,
                label: 'Create Membership History',
            },
        ];
    }

    navbarProps!: HeaderNavbarProps;
}

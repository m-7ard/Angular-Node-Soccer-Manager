import { Component, Input } from '@angular/core';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import { CommonModule } from '@angular/common';
import { DividerComponent } from "../divider/divider.component";
import { CoverImageComponent } from "../cover-image/cover-image.component";
import TeamMembershipHistory from '../../models/TeamMembershipHistory';

@Component({
    selector: 'app-team-membership-history-element',
    standalone: true,
    imports: [MixinStyledButtonDirective, MixinStyledCardDirectivesModule, CommonModule, DividerComponent, CoverImageComponent],
    templateUrl: './team-membership-history-element.component.html',
})
export class TeamMembershipHistoryElement {
    @Input() teamMembershipHistory!: TeamMembershipHistory;
}

import { Component, Input, OnInit } from '@angular/core';
import { MixinStyledCardDirectivesModule } from '../../styled-card/styled-card.module';
import { CommonModule } from '@angular/common';
import TeamMembershipHistory from '../../../models/TeamMembershipHistory';
import { RouterModule } from '@angular/router';
import TeamMembership from '../../../models/TeamMembership';

@Component({
    selector: 'app-team-membership-history-element',
    standalone: true,
    imports: [MixinStyledCardDirectivesModule, CommonModule, RouterModule],
    templateUrl: './team-membership-history-element.component.html',
})
export class TeamMembershipHistoryElement implements OnInit {
    @Input() teamMembership!: TeamMembership;
    @Input() teamMembershipHistory!: TeamMembershipHistory;

    url!: string;

    ngOnInit(): void {
        this.url = `/teams/${this.teamMembership.teamId}/memberships/${this.teamMembership.id}/histories/${this.teamMembershipHistory.id}`;
        console.log(this.url);
    }
}

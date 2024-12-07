import { Component, inject, Input } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { MixinButtonComponent } from "../../../../ui-mixins/mixin-button/mixin-button.component";
import { RouterModule } from '@angular/router';
import Team from '../../../../models/Team';
import { DeleteTeamMembershipModal, DeleteTeamMembershipModalProps } from '../../delete-team-membership-modal/delete-team-membership-modal.component';
import TeamPlayer from '../../../../models/TeamPlayer';

@Component({
    selector: 'app-list-team-players-page-team-player-element',
    standalone: true,
    imports: [CoverImageComponent, CommonModule, MixinButtonComponent, RouterModule, DeleteTeamMembershipModal],
    templateUrl: './list-team-players-page-team-player-element.component.html',
})
export class ListTeamPlayerPageTeamPlayerElementComponent {
    private dialog = inject(Dialog);
    @Input() teamPlayer!: TeamPlayer;
    @Input() team!: Team;

    openDeleteMembershipModal(): void {
        const data: DeleteTeamMembershipModalProps = {
            team: this.team,
            teamPlayer: this.teamPlayer
        };

        this.dialog.open(DeleteTeamMembershipModal, {
            data: data,
        });
    }
}

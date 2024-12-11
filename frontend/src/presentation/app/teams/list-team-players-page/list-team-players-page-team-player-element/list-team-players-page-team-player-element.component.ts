import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { MixinButtonComponent } from "../../../../ui-mixins/mixin-button/mixin-button.component";
import { RouterModule } from '@angular/router';
import Team from '../../../../models/Team';
import { DeleteTeamMembershipModal, DeleteTeamMembershipModalProps } from '../../delete-team-membership-modal/delete-team-membership-modal.component';
import TeamPlayer from '../../../../models/TeamPlayer';
import { MixinPrototypeCardDirective } from '../../../../reusables/prototype-card/prototype-card';
import { MixinPrototypeCardSectionDirective } from '../../../../reusables/prototype-card/prototype-card-section';

@Component({
    selector: 'app-list-team-players-page-team-player-element',
    standalone: true,
    imports: [CoverImageComponent, CommonModule, MixinButtonComponent, RouterModule, MixinPrototypeCardDirective, MixinPrototypeCardSectionDirective],
    templateUrl: './list-team-players-page-team-player-element.component.html',
})
export class ListTeamPlayerPageTeamPlayerElementComponent {
    private dialog = inject(Dialog);
    @Input() teamPlayer!: TeamPlayer;
    @Input() team!: Team;
    @Output() onDelete = new EventEmitter<TeamPlayer>();

    openDeleteMembershipModal(): void {
        const data: DeleteTeamMembershipModalProps = {
            team: this.team,
            teamPlayer: this.teamPlayer,
            onSuccess: () => this.onDelete.emit(this.teamPlayer)
        };

        this.dialog.open(DeleteTeamMembershipModal, {
            data: data,
        });
    }
}

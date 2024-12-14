import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CoverImageComponent } from '../../../../../reusables/cover-image/cover-image.component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { RouterModule } from '@angular/router';
import Team from '../../../../../models/Team';
import {
    DeleteTeamMembershipModal,
    DeleteTeamMembershipModalProps,
} from '../../../delete-team-membership-modal/delete-team-membership-modal.component';
import TeamPlayer from '../../../../../models/TeamPlayer';
import { ZeebraTextComponent } from '../../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinStyledButtonDirective } from '../../../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';
import { MixinStyledCardDirective } from '../../../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../../../reusables/styled-card/styled-card-section.directive';

@Component({
    selector: 'app-list-team-players-page-team-player-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        CommonModule,
        RouterModule,
        ZeebraTextComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective
    ],
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
            onSuccess: () => this.onDelete.emit(this.teamPlayer),
        };

        this.dialog.open(DeleteTeamMembershipModal, {
            data: data,
        });
    }
}

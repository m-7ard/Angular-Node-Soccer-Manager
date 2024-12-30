import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
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
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { Popover, PopoverModule } from 'primeng/popover';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { PanelDirectivesModule } from '../../../../../reusables/panel/panel.directive.module';
import { PrimeNgPopoverDirective } from '../../../../../reusables/prime-ng-popover/prime-ng-popover.directive';

@Component({
    selector: 'app-list-team-players-page-team-player-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        CommonModule,
        RouterModule,
        ZeebraTextComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PrimeNgPopoverDirective,
        PanelDirectivesModule,
        DividerComponent,
        PopoverModule,
    ],
    templateUrl: './list-team-players-page-team-player-element.component.html',
})
export class ListTeamPlayerPageTeamPlayerElementComponent {
    @Input() teamPlayer!: TeamPlayer;
    @Input() team!: Team;
    @Output() onDelete = new EventEmitter<TeamPlayer>();

    @ViewChild('op') op!: Popover;
    private dialog = inject(Dialog);

    openDeleteMembershipModal(): void {
        const data: DeleteTeamMembershipModalProps = {
            team: this.team,
            teamPlayer: this.teamPlayer,
            onSuccess: () => this.onDelete.emit(this.teamPlayer),
        };

        this.dialog.open(DeleteTeamMembershipModal, {
            data: data,
        });

        this.op.hide();
    }
}

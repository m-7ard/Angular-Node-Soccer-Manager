import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import Team from '../../../../models/Team';
import { DeleteTeamModal, DeleteTeamModalProps } from '../../delete-team-modal/delete-team-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { CoverImageComponent } from "../../../../reusables/cover-image/cover-image.component";
import { MixinButtonComponent } from "../../../../ui-mixins/mixin-button/mixin-button.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-teams-page-team-element',
  standalone: true,
  imports: [CoverImageComponent, MixinButtonComponent, RouterModule, CommonModule],
  templateUrl: './list-teams-page-team-element.component.html',
})
export class ListTeamsPageTeamElementComponent {
    private dialog = inject(Dialog);
    @Input() team!: Team;
    @Output() onDelete = new EventEmitter<Team>();

    openDeleteTeamModal(): void {
        const data: DeleteTeamModalProps = {
            team: this.team,
            onSuccess: () => this.onDelete.emit(this.team)
        };

        this.dialog.open(DeleteTeamModal, {
            data: data,
        });
    }
}

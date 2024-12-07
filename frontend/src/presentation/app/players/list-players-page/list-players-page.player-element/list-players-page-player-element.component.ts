import { Component, inject, Input } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Player from '../../../../models/Player';
import { CommonModule } from '@angular/common';
import { DeletePlayerModal, DeletePlayerModalProps } from '../../delete-player-modal/delete-player-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { MixinButtonComponent } from "../../../../ui-mixins/mixin-button/mixin-button.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-list-players-page-player-element',
    standalone: true,
    imports: [CoverImageComponent, CommonModule, MixinButtonComponent, RouterModule],
    templateUrl: './list-players-page-player-element.component.html',
})
export class ListPlayersPagePlayerElementComponent {
    private dialog = inject(Dialog);
    @Input() player!: Player;

    openDeletePlayerModal(): void {
        const data: DeletePlayerModalProps = {
            player: this.player,
        };

        const dialogRef = this.dialog.open(DeletePlayerModal, {
            data: data,
        });
    }
}

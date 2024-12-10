import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Player from '../../../../models/Player';
import { CommonModule } from '@angular/common';
import { DeletePlayerModal, DeletePlayerModalProps } from '../../delete-player-modal/delete-player-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { MixinButtonComponent } from '../../../../ui-mixins/mixin-button/mixin-button.component';
import { RouterModule } from '@angular/router';
import { MixinPrototypeCardSectionDirective } from '../../../../reusables/prototype-card/prototype-card-section';
import { MixinPrototypeCardDirective } from '../../../../reusables/prototype-card/prototype-card';

@Component({
    selector: 'app-list-players-page-player-element',
    standalone: true,
    imports: [CoverImageComponent, CommonModule, MixinButtonComponent, RouterModule, MixinPrototypeCardDirective, MixinPrototypeCardSectionDirective],
    templateUrl: './list-players-page-player-element.component.html',
})
export class ListPlayersPagePlayerElementComponent {
    private dialog = inject(Dialog);
    @Input() player!: Player;
    @Output() onDelete = new EventEmitter<Player>();

    openDeletePlayerModal(): void {
        const data: DeletePlayerModalProps = {
            player: this.player,
            onSuccess: () => this.onDelete.emit(this.player),
        };

        const dialogRef = this.dialog.open(DeletePlayerModal, {
            data: data,
        });
    }
}

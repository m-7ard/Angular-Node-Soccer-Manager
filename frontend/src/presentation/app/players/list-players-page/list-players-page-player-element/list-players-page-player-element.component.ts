import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Player from '../../../../models/Player';
import { CommonModule } from '@angular/common';
import { DeletePlayerModal, DeletePlayerModalProps } from '../../delete-player-modal/delete-player-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { RouterModule } from '@angular/router';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirective } from '../../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../../reusables/styled-card/styled-card-section.directive';

@Component({
    selector: 'app-list-players-page-player-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        CommonModule,
        RouterModule,
        ZeebraTextComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
    ],
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

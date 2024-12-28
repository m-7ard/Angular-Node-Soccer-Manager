import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Player from '../../../../models/Player';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirective } from '../../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../../reusables/styled-card/styled-card-section.directive';
import { PopoverTriggerDirective } from '../../../../reusables/popover/popover-trigger.directive';
import { MenuComponent } from './list-players-page-player-element.menu.component';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { Dialog } from '@angular/cdk/dialog';
import { DeletePlayerModalProps, DeletePlayerModal } from '../../delete-player-modal/delete-player-modal.component';

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
        PopoverTriggerDirective,
        MatMenuModule,
    ],
    templateUrl: './list-players-page-player-element.component.html',
})
export class ListPlayersPagePlayerElementComponent {
    @Input() player!: Player;
    @Output() onDelete = new EventEmitter<Player>();

    @ViewChild('menu') menu!: MatMenu;
    @ViewChild('button', { static: true }) button: any;

    private dialog = inject(Dialog);

    openDeletePlayerModal(): void {
        const data: DeletePlayerModalProps = {
            player: this.player,
            onSuccess: () => this.onDelete.emit(this.player),
        };

        const dialogRef = this.dialog.open(DeletePlayerModal, {
            data: data,
        });
    }

    protected MenuComponent = MenuComponent;
}

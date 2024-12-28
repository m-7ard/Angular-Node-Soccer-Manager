import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Player from '../../../../models/Player';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirective } from '../../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../../reusables/styled-card/styled-card-section.directive';
import { PopoverContext, PopoverTriggerDirective } from '../../../../reusables/popover/popover-trigger.directive';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { Dialog } from '@angular/cdk/dialog';
import { DeletePlayerModalProps, DeletePlayerModal } from '../../delete-player-modal/delete-player-modal.component';
import { PanelDirectivesModule } from '../../../../reusables/panel/panel.directive.module';
import { DividerComponent } from "../../../../reusables/divider/divider.component";

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
    PanelDirectivesModule,
    DividerComponent
],
    templateUrl: './list-players-page-player-element.component.html',
})
export class ListPlayersPagePlayerElementComponent {
    @Input() player!: Player;
    @Output() onDelete = new EventEmitter<Player>();

    menuTemplate!: TemplateRef<PopoverContext<{}>>;

    private dialog = inject(Dialog);

    openDeletePlayerModal(closeMenu: PopoverContext<{}>["close"]): void {
        const data: DeletePlayerModalProps = {
            player: this.player,
            onSuccess: () => this.onDelete.emit(this.player),
        };

        const dialogRef = this.dialog.open(DeletePlayerModal, {
            data: data,
        });

        closeMenu();
    }
}

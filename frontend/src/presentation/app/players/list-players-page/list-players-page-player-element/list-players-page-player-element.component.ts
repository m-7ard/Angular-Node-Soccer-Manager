import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Player from '../../../../models/Player';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MatMenuModule } from '@angular/material/menu';
import { Dialog } from '@angular/cdk/dialog';
import { DeletePlayerModalProps, DeletePlayerModal } from '../../delete-player-modal/delete-player-modal.component';
import { PanelDirectivesModule } from '../../../../reusables/panel/panel.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { Popover, PopoverModule } from 'primeng/popover';
import { PrimeNgPopoverDirective } from '../../../../reusables/prime-ng-popover/prime-ng-popover.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';

@Component({
    selector: 'app-list-players-page-player-element',
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
    templateUrl: './list-players-page-player-element.component.html',
})
export class ListPlayersPagePlayerElementComponent {
    @Input() player!: Player;
    @Output() onDelete = new EventEmitter<Player>();

    @ViewChild('op') op!: Popover;

    private dialog = inject(Dialog);

    openDeletePlayerModal(): void {
        const data: DeletePlayerModalProps = {
            player: this.player,
            onSuccess: () => this.onDelete.emit(this.player),
        };

        const dialogRef = this.dialog.open(DeletePlayerModal, {
            data: data,
        });

        this.op.hide();
    }
}

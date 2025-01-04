import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MatMenuModule } from '@angular/material/menu';
import { Popover, PopoverModule } from 'primeng/popover';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { PanelDirectivesModule } from '../../../../reusables/panel/panel.directive.module';
import { PrimeNgPopoverDirective } from '../../../../reusables/prime-ng-popover/prime-ng-popover.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import Match from '../../../../models/Match';
import { DeleteMatchModalProps, DeleteMatchModal } from '../../delete-match-component/delete-match-component.component';

@Component({
    selector: 'app-list-matches-page-match-element',
    standalone: true,
    imports: [
        CoverImageComponent,
        RouterModule,
        CommonModule,
        MixinStyledCardDirectivesModule,
        MixinStyledButtonDirective,
        PrimeNgPopoverDirective,
        MatMenuModule,
        PanelDirectivesModule,
        DividerComponent,
        PopoverModule,
        PanelDirectivesModule,
        DividerComponent,
        PopoverModule,
    ],
    templateUrl: './list-matches-page-match-element.component.html',
})
export class ListMatchsPageMatchElementComponent {
    @Input() match!: Match;
    @Output() onDelete = new EventEmitter<Match>();

    @ViewChild('op') op!: Popover;
    private dialog = inject(Dialog);

    openDeleteMatchModal(): void {
        const data: DeleteMatchModalProps = {
            match: this.match,
            onSuccess: () => this.onDelete.emit(this.match),
        };

        this.dialog.open(DeleteMatchModal, {
            data: data,
        });

        this.op.hide();
    }
}

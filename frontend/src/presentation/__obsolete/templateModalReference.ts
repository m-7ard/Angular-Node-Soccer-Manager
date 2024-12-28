import { CommonModule } from "@angular/common";
import { Component, Input, ViewChild, TemplateRef } from "@angular/core";
import { RouterModule } from "@angular/router";
import Player from "../models/Player";
import { MixinStyledButtonDirective } from "../reusables/styled-button/styled-button.directive";
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-list-players-page-player-element',
    standalone: true,
    imports: [CommonModule, RouterModule, MixinStyledButtonDirective],
    host: {
        class: 'fixed',
    },
    template: `
        <div class="mixin-panel-like mixin-panel-base theme-panel-generic-white token-default-shadow">
            <div data-role="panel-section" class="flex flex-col gap-1">
                <button
                    [routerLink]="'/players/' + player.id + '/update'"
                    useRouterLink
                    appMixinStyledButton
                    class="justify-center"
                    theme="theme-Sbutton-generic-green"
                    size="mixin-Sbutton-base"
                >
                    Update
                </button>
                <button
                    appMixinStyledButton
                    class="justify-center"
                    theme="theme-Sbutton-generic-red"
                    size="mixin-Sbutton-base"
                    (click)="openDeletePlayerModal(deleteModal)"
                >
                    Delete
                </button>
            </div>
        </div>

        <!-- Template for Delete Modal -->
        <ng-template #deleteModal>
            <h1 mat-dialog-title>Delete Player</h1>
            <div mat-dialog-content>
                <p>Are you sure you want to delete {{ player.name }}?</p>
            </div>
            <div mat-dialog-actions align="end">
                <button mat-button (click)="closeModal()">Cancel</button>
                <button mat-button color="warn" (click)="confirmDelete()">Delete</button>
            </div>
        </ng-template>
    `,
})
export class MenuComponent {
    @Input() player!: Player;
    @Input() onDelete!: () => void;

    @ViewChild('deleteModal') deleteModalRef!: TemplateRef<any>;

    constructor(private dialog: MatDialog) {}

    openDeletePlayerModal(templateRef: TemplateRef<any>): void {
        this.dialog.open(templateRef);
    }

    closeModal(): void {
        this.dialog.closeAll();
    }

    confirmDelete(): void {
        this.onDelete();
        this.closeModal();
    }
}
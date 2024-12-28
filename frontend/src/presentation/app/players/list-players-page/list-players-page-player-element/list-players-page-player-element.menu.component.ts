import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import Player from '../../../../models/Player';
import { CommonModule } from '@angular/common';
import { DeletePlayerModal, DeletePlayerModalProps } from '../../delete-player-modal/delete-player-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { RouterModule } from '@angular/router';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import {MatMenuModule} from '@angular/material/menu';

@Component({
    selector: 'app-list-players-page-player-element',
    standalone: true,
    imports: [CommonModule, RouterModule, MixinStyledButtonDirective, MatMenuModule],
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
                    (click)="openDeletePlayerModal()"
                >
                    Delete
                </button>
            </div>
        </div>
    `,
})
export class MenuComponent {
    private dialog = inject(Dialog);

    @Input() player!: Player;
    @Input() onDelete!: () => void;

    openDeletePlayerModal(): void {
        const data: DeletePlayerModalProps = {
            player: this.player,
            onSuccess: () => this.onDelete(),
        };

        const dialogRef = this.dialog.open(DeletePlayerModal, {
            data: data,
        });
    }
}

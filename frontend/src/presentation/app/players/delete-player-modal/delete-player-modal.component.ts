import { Component, Inject } from '@angular/core';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import Player from '../../../models/Player';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import IPresentationError from '../../../errors/IPresentationError';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';

export interface DeletePlayerModalProps {
    player: Player;
    onSuccess: () => void;
}

@Component({
    selector: 'app-delete-player-modal',
    standalone: true,
    imports: [MixinButtonComponent, CommonModule, FormErrorsComponent],
    templateUrl: './delete-player-modal.component.html',
})
export class DeletePlayerModal {
    errors: IPresentationError<{}> = {};
    player: DeletePlayerModalProps['player'];
    onSuccess: DeletePlayerModalProps['onSuccess'];

    constructor(
        public dialogRef: DialogRef<Player>,
        @Inject(DIALOG_DATA) public data: DeletePlayerModalProps,
        private playerDataAccess: PlayerDataAccessService,
    ) {
        this.player = this.data.player;
        this.onSuccess = this.data.onSuccess;
    }

    closeModal() {
        this.dialogRef.close();
    }

    async onSubmit() {
        this.playerDataAccess
            .delete(this.data.player.id, {})
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    return of(null);
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }

                    this.onSuccess();
                    this.closeModal();
                },
            });
    }
}

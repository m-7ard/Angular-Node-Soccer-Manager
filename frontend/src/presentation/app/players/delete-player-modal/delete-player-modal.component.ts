import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import Player from '../../../models/Player';
import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import IPresentationError from '../../../errors/IPresentationError';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';

export interface DeletePlayerModalProps {
    player: Player;
    onSuccess: () => void;
}

@Component({
    selector: 'app-delete-player-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormErrorsComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
    ],
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

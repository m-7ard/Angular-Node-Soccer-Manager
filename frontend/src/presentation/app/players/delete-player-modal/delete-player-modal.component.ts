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
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { PanelDirectivesModule } from '../../../reusables/panel/panel.directive.module';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { DividerComponent } from "../../../reusables/divider/divider.component";

export interface DeletePlayerModalProps {
    player: Player;
    onSuccess: () => void;
}

@Component({
    selector: 'app-delete-player-modal',
    standalone: true,
    imports: [CommonModule, FormErrorsComponent, PanelDirectivesModule, MixinStyledButtonDirective, DividerComponent],
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
        private exceptionNoticeService: ExceptionNoticeService,
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
                    if (err.status === 400) {
                        this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    } else {
                        this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    }

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

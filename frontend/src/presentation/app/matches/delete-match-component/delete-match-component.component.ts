import { Component, Inject } from '@angular/core';
import Match from '../../../models/Match';
import { MatchDataAccessService } from '../../../services/data-access/match-data-access.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';
import { CommonModule } from '@angular/common';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { PanelDirectivesModule } from '../../../reusables/panel/panel.directive.module';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';

export interface DeleteMatchModalProps {
    match: Match;
    onSuccess: () => void;
}

@Component({
    selector: 'app-delete-match-component',
    standalone: true,
    imports: [CommonModule, FormErrorsComponent, PanelDirectivesModule, MixinStyledButtonDirective, DividerComponent],
    templateUrl: './delete-match-component.component.html',
})
export class DeleteMatchModal implements DeleteMatchModalProps {
    errors: IPresentationError<{}> = {};
    match: Match;
    onSuccess: () => void;

    constructor(
        public dialogRef: DialogRef<Match>,
        @Inject(DIALOG_DATA) public data: DeleteMatchModalProps,
        private matchDataAccess: MatchDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {
        this.match = this.data.match;
        this.onSuccess = this.data.onSuccess;
    }

    closeModal() {
        this.dialogRef.close();
    }

    async onSubmit() {
        this.matchDataAccess
            .delete(this.data.match.id, {})
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

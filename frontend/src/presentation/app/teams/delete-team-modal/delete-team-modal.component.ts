import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import IPresentationError from '../../../errors/IPresentationError';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import Team from '../../../models/Team';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';

export interface DeleteTeamModalProps {
    team: Team;
    onSuccess: () => void;
}

@Component({
    selector: 'app-delete-team-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormErrorsComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
    ],
    templateUrl: './delete-team-modal.component.html',
})
export class DeleteTeamModal {
    errors: IPresentationError<{}> = {};
    team: DeleteTeamModalProps['team'];
    onSuccess: DeleteTeamModalProps['onSuccess'];

    constructor(
        public dialogRef: DialogRef,
        @Inject(DIALOG_DATA) public data: DeleteTeamModalProps,
        private teamDataAccess: TeamDataAccessService,
    ) {
        this.team = this.data.team;
        this.onSuccess = this.data.onSuccess;
    }

    closeModal() {
        this.dialogRef.close();
    }

    async onSubmit() {
        this.teamDataAccess
            .delete(this.team.id)
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

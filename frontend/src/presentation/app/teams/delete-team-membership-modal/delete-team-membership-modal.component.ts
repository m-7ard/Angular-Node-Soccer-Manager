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
import TeamPlayer from '../../../models/TeamPlayer';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PanelDirectivesModule } from '../../../reusables/panel/panel.directive.module';

export interface DeleteTeamMembershipModalProps {
    teamPlayer: TeamPlayer;
    team: Team;
    onSuccess: () => void;
}

@Component({
    selector: 'app-delete-team-membership-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormErrorsComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        DividerComponent,
        PanelDirectivesModule,
    ],
    templateUrl: './delete-team-membership-modal.component.html',
})
export class DeleteTeamMembershipModal {
    errors: IPresentationError<{}> = {};
    teamPlayer: DeleteTeamMembershipModalProps['teamPlayer'];
    team: DeleteTeamMembershipModalProps['team'];
    onSuccess: DeleteTeamMembershipModalProps['onSuccess'];

    constructor(
        public dialogRef: DialogRef,
        @Inject(DIALOG_DATA) public data: DeleteTeamMembershipModalProps,
        private teamDataAccess: TeamDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {
        this.teamPlayer = this.data.teamPlayer;
        this.team = this.data.team;
        this.onSuccess = this.data.onSuccess;
    }

    closeModal() {
        this.dialogRef.close();
    }

    async onSubmit() {
        const membership = this.data.teamPlayer.membership;

        this.teamDataAccess
            .removePlayer(membership.teamId, membership.playerId, {})
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

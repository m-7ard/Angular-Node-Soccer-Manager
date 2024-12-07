import { Component, Inject } from '@angular/core';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import IPresentationError from '../../../errors/IPresentationError';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import TeamMembership from '../../../models/TeamMembership';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import Team from '../../../models/Team';
import TeamPlayer from '../../../models/TeamPlayer';

export interface DeleteTeamMembershipModalProps {
    teamPlayer: TeamPlayer;
    team: Team;
}

@Component({
    selector: 'app-delete-team-membership-modal',
    standalone: true,
    imports: [MixinButtonComponent, CommonModule, FormErrorsComponent],
    templateUrl: './delete-team-membership-modal.component.html',
})
export class DeleteTeamMembershipModal {
    errors: IPresentationError<{}> = {};
    teamPlayer: TeamPlayer;
    team: Team;

    constructor(
        public dialogRef: DialogRef,
        @Inject(DIALOG_DATA) public data: DeleteTeamMembershipModalProps,
        private teamDataAccess: TeamDataAccessService,
    ) {
        this.teamPlayer = this.data.teamPlayer;
        this.team = this.data.team;
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
                    this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    return of(null);
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }

                    this.closeModal();
                },
            });
    }
}

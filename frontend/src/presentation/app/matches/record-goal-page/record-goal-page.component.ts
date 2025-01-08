import { Component } from '@angular/core';
import Player from '../../../models/Player';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { object, string, date } from 'superstruct';
import IPresentationError from '../../../errors/IPresentationError';
import Team from '../../../models/Team';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { MatchDataAccessService } from '../../../services/data-access/match-data-access.service';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';
import structErrorToPresentationError from '../../../utils/structErrorToPresentationError';
import validateSuperstruct from '../../../utils/validateSuperstuct';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { PickSingleTeamComponent } from '../../../reusables/pick-single-team/pick-single-team.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { PickSinglePlayerComponent } from "../../../reusables/pick-single-player/pick-single-player.component";

interface IFormControls {
    team: FormControl<Team | null>;
    player: FormControl<Player | null>;
    dateOccured: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    teamId: string[];
    playerId: string[];
    dateOccured: string[];
}>;

const validator = object({
    teamId: string(),
    playerId: string(),
    dateOccured: date(),
});

@Component({
    selector: 'app-record-goal-page',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    CharFieldComponent,
    FormFieldComponent,
    CommonModule,
    MixinStyledButtonDirective,
    MixinStyledCardDirectivesModule,
    FormErrorsComponent,
    PageDirectivesModule,
    ContentGridDirective,
    ContentGridTrackDirective,
    DividerComponent,
    PickSingleTeamComponent,
    PickSinglePlayerComponent
],
    templateUrl: './record-goal-page.component.html',
})
export class RecordGoalPageComponent {
    form!: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    matchId!: string;

    constructor(
        private activtedRoute: ActivatedRoute,
        private router: Router,
        private matchDataAccess: MatchDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup<IFormControls>({
            team: new FormControl(null, {
                validators: [Validators.required],
            }),
            player: new FormControl(null, {
                validators: [Validators.required],
            }),
            dateOccured: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.activtedRoute.paramMap.subscribe((parms) => {
            const matchId = parms.get('matchId');

            if (matchId == null) {
                throw new ClientSideErrorException('Record Goal Page: matchId parameter is null.');
            }

            this.matchId = matchId;
        });
    }

    onReset() {
        this.form.reset();
    }

    onSubmit() {
        const rawValue = this.form.getRawValue();
        const validation = validateSuperstruct(
            {
                teamId: rawValue.team?.id,
                playerId: rawValue.player?.id,
                dateOccured: new Date(rawValue.dateOccured),
            },
            validator,
        );
        if (validation.isErr()) {
            this.errors = structErrorToPresentationError(validation.error);
            return;
        }

        const data = validation.value;

        this.matchDataAccess
            .recordGoal(this.matchId, {
                teamId: data.teamId,
                playerId: data.playerId,
                dateOccured: data.dateOccured,
            })
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

                    this.router.navigate([`/matches`]);
                },
            });
    }
}

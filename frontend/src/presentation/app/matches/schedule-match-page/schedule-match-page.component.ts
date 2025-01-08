import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { MatchDataAccessService } from '../../../services/data-access/match-data-access.service';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';
import IPresentationError from '../../../errors/IPresentationError';
import Team from '../../../models/Team';
import { object, string, date } from 'superstruct';
import validateSuperstruct from '../../../utils/validateSuperstuct';
import structErrorToPresentationError from '../../../utils/structErrorToPresentationError';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { PickSingleTeamComponent } from '../../../reusables/pick-single-team/pick-single-team.component';

interface IFormControls {
    homeTeam: FormControl<Team | null>;
    awayTeam: FormControl<Team | null>;
    venue: FormControl<string>;
    scheduledDate: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    awayTeamId: string[];
    homeTeamId: string[];
    venue: string[];
    scheduledDate: string[];
}>;

const validator = object({
    homeTeamId: string(),
    awayTeamId: string(),
    venue: string(),
    scheduledDate: date(),
});

@Component({
    selector: 'app-schedule-match-page',
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
    ],
    templateUrl: './schedule-match-page.component.html',
})
export class ScheduleMatchPageComponent {
    form!: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private matchDataAccess: MatchDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup<IFormControls>({
            awayTeam: new FormControl(null, {
                validators: [Validators.required],
            }),
            homeTeam: new FormControl(null, {
                validators: [Validators.required],
            }),
            venue: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            scheduledDate: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    onReset() {
        this.form.reset();
    }

    onSubmit() {
        const rawValue = this.form.getRawValue();
        const validation = validateSuperstruct(
            {
                homeTeamId: rawValue.homeTeam?.id,
                awayTeamId: rawValue.awayTeam?.id,
                venue: rawValue.venue,
                scheduledDate: new Date(rawValue.scheduledDate),
            },
            validator,
        );
        if (validation.isErr()) {
            this.errors = structErrorToPresentationError(validation.error);
            return;
        }

        const data = validation.value;

        this.matchDataAccess
            .scheduleMatch({
                awayTeamId: data.awayTeamId,
                homeTeamId: data.homeTeamId,
                venue: data.venue,
                scheduledDate: new Date(data.scheduledDate),
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

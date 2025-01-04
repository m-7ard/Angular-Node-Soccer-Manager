import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { object, string, date } from 'superstruct';
import IPresentationError from '../../../errors/IPresentationError';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { MatchDataAccessService } from '../../../services/data-access/match-data-access.service';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';
import structErrorToPresentationError from '../../../utils/structErrorToPresentationError';
import validateSuperstruct from '../../../utils/validateSuperstuct';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';

interface IFormControls {
    startDate: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    startDate: string[];
}>;

const validator = object({
    startDate: date(),
});

@Component({
    selector: 'app-mark-in-progress-page',
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
    templateUrl: './mark-in-progress-page.component.html',
})
export class MarkInProgressPageComponent implements OnInit {
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
            startDate: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.activtedRoute.paramMap.subscribe((parms) => {
            const matchId = parms.get('matchId');

            if (matchId == null) {
                throw new ClientSideErrorException('Schedule Match Page: matchId parameter is null.');
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
                startDate: new Date(rawValue.startDate),
            },
            validator,
        );
        if (validation.isErr()) {
            this.errors = structErrorToPresentationError(validation.error);
            return;
        }

        const data = validation.value;

        this.matchDataAccess
            .markInProgress(this.matchId, { startDate: data.startDate })
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

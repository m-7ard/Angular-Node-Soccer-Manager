import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import { CharFieldComponent } from '../../../../../reusables/char-field/char-field.component';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import structErrorToPresentationError from '../../../../../utils/structErrorToPresentationError';
import validateSuperstruct from '../../../../../utils/validateSuperstuct';
import IPresentationError from '../../../../../errors/IPresentationError';
import { object, date } from 'superstruct';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';

interface IFormControls {
    endDate: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    endDate: string[];
}>;

const validator = object({
    endDate: date(),
});

@Component({
    selector: 'app-mark-completed-page',
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
        ContentGridDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './mark-completed-page.component.html',
})
export class MarkCompletedPageComponent {
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
            endDate: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.activtedRoute.parent?.paramMap.subscribe((parms) => {
            const matchId = parms.get('matchId');

            if (matchId == null) {
                throw new ClientSideErrorException('Mark Match Completed Page: matchId parameter is null.');
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
                endDate: new Date(rawValue.endDate),
            },
            validator,
        );
        if (validation.isErr()) {
            this.errors = structErrorToPresentationError(validation.error);
            return;
        }

        const data = validation.value;

        this.matchDataAccess
            .markCompleted(this.matchId, { endDate: data.endDate })
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

                    this.router.navigate([`/matches/${this.matchId}`]);
                },
            });
    }
}

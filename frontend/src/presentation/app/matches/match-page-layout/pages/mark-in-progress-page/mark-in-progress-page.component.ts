import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CharFieldComponent } from '../../../../../reusables/char-field/char-field.component';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { object, date } from 'superstruct';
import IPresentationError from '../../../../../errors/IPresentationError';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import structErrorToPresentationError from '../../../../../utils/structErrorToPresentationError';
import validateSuperstruct from '../../../../../utils/validateSuperstuct';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';
import Match from '../../../../../models/Match';
import { IMatchPageLayoutResolverData } from '../../match-page-layout.resolver';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';

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
        ContentGridDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './mark-in-progress-page.component.html',
    providers: [DatePipe],
})
export class MarkInProgressPageComponent implements OnInit {
    form!: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    match!: Match;

    startDateHelperTexts!: string[];

    constructor(
        private activtedRoute: ActivatedRoute,
        private router: Router,
        private matchDataAccess: MatchDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup<IFormControls>({
            startDate: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.activtedRoute.parent?.paramMap.subscribe((parms) => {
            const data: IMatchPageLayoutResolverData = this.activtedRoute.parent?.snapshot.data[RESOLVER_DATA_KEY];

            if (data == null) {
                throw new ClientSideErrorException('Mark Match In Progress Page: Could not get match data.');
            }

            this.match = data.match;
        });

        this.startDateHelperTexts = [
            `Start Date must be greater or equal than ${this.datePipe.transform(this.match.scheduledDate, 'yyyy-MM-dd HH:mm:ss')}`,
        ];
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
            .markInProgress(this.match.id, { startDate: data.startDate })
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

                    this.router.navigate([`/matches/${this.match.id}`]);
                },
            });
    }
}

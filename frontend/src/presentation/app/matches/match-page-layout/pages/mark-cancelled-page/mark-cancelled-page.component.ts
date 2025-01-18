import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import { MatchDataAccessService } from '../../../../../services/data-access/match-data-access.service';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import IPresentationError from '../../../../../errors/IPresentationError';
import { object } from 'superstruct';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../../../reusables/char-field/char-field.component';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { PageDirectivesModule } from '../../../../../reusables/page/page.directive.module';
import { PickSingleTeamComponent } from '../../../../../reusables/pick-single-team/pick-single-team.component';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../../reusables/styled-card/styled-card.module';
import { ContentGridDirectivesModule } from '../../../../../reusables/content-grid/content-grid.directive.module';

interface IFormControls {}

type IErrorSchema = IPresentationError<{}>;

const validator = object({});

@Component({
    selector: 'app-mark-cancelled-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        FormErrorsComponent,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './mark-cancelled-page.component.html',
})
export class MarkCancelledPageComponent {
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
                throw new ClientSideErrorException('Mark Match Cancelled Page: matchId parameter is null.');
            }

            this.matchId = matchId;
        });
    }

    onReset() {
        this.form.reset();
    }

    onSubmit() {
        this.matchDataAccess
            .markCancelled(this.matchId, {})
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { Router } from '@angular/router';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import { CommonModule } from '@angular/common';
import IPresentationError from '../../../errors/IPresentationError';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { HttpErrorResponse } from '@angular/common/http';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';

interface IFormControls {
    name: FormControl<string>;
    dateFounded: FormControl<string>;
    number: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    dateFounded: string[];
    name: string[];
}>;

@Component({
    selector: 'app-create-team-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
    ],
    templateUrl: './create-team-page.component.html',
})
export class CreateTeamPageComponent implements OnInit {
    form!: FormGroup;
    errors: IErrorSchema = {};

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            dateFounded: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            number: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            })
        });
        
        this.form = this.fb.group({
            name: new FormControl('', [Validators.required]),
            dateFounded: new FormControl('', [Validators.required]),
            number: new FormControl('', [Validators.required]),
        });
    }

    onSubmit(): void {
        const value = this.form.value;

        const requestObserver = this.teamDataAccess.createTeam({
            dateFounded: value.dateFounded,
            name: value.name,
        });

        requestObserver
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
                next: (body) => {
                    if (body == null) {
                        return;
                    }

                    this.router.navigate(['/teams']);
                },
            });
    }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import IPresentationError from '../../../errors/IPresentationError';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../reusables/content-grid/page.directive';
import { PageSectionDirective } from '../../../reusables/page/page-section.directive';
import { PageDirective } from '../../../reusables/page/page.directive';

interface IFormControls {
    email: FormControl<string>;
    password: FormControl<string>;
    name: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    email: string[];
    password: string[];
    name: string[];
}>;

@Component({
    selector: 'app-register-user-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        FormErrorsComponent,
        PageDirective,
        PageSectionDirective,
        ContentGridDirective,
        ContentGridTrackDirective,
    ],
    templateUrl: './register-user-page.component.html',
})
export class RegisterUserPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private authService: AuthService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {
        this.form = new FormGroup<IFormControls>({
            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            password: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    onReset(): void {
        this.form.reset({
            email: '',
            password: '',
            name: '',
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.authService
            .register({
                email: rawValue.email,
                password: rawValue.password,
                name: rawValue.name,
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

                    this.router.navigate(['/users/login']);
                },
            });
    }
}

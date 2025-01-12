import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import IPresentationError from '../../../errors/IPresentationError';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { ContentDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';

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
        PageDirectivesModule,
        ContentDirectivesModule,
        DividerComponent,
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

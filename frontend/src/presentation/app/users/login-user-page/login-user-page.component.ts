import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { ExceptionNoticeService } from '../../../services/exception-notice-service';
import { DividerComponent } from "../../../reusables/divider/divider.component";
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';

interface IFormControls {
    email: FormControl<string>;
    password: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    email: string[];
    password: string[];
}>;

@Component({
    selector: 'app-login-user-page',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    CharFieldComponent,
    FormFieldComponent,
    CommonModule,
    MixinStyledButtonDirective,
    FormErrorsComponent,
    DividerComponent,
    PageDirectivesModule,
    ContentGridDirective,
    ContentGridTrackDirective
],
    templateUrl: './login-user-page.component.html',
})
export class LoginUserPageComponent {
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
        });
    }
    
    onReset(): void {
        this.form.reset({
            email: "",
            password: ""
        })
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.authService
            .login({
                email: rawValue.email,
                password: rawValue.password,
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

                    this.router.navigate(['/']);
                },
            });
    }
}

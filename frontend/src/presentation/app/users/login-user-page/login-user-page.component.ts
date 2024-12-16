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
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';
import { FormErrorsComponent } from "../../../reusables/form-errors/form-errors";

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
    MixinStyledCardDirective,
    MixinStyledCardSectionDirective,
    FormErrorsComponent
],
    templateUrl: './login-user-page.component.html',
})
export class LoginUserPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private authService: AuthService,
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

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.authService
            .login({
                email: rawValue.email,
                password: rawValue.password,
            })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
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

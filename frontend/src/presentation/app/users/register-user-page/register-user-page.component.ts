import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import IPresentationError from '../../../errors/IPresentationError';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinStyledCardSectionDirective } from '../../../reusables/styled-card/styled-card-section.directive';
import { MixinStyledCardDirective } from '../../../reusables/styled-card/styled-card.directive';
import { MixinStyledButtonDirective } from '../../../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { FormErrorsComponent } from "../../../reusables/form-errors/form-errors";

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
    MixinStyledCardDirective,
    MixinStyledCardSectionDirective,
    FormErrorsComponent
],
    templateUrl: './register-user-page.component.html',
})
export class RegisterUserPageComponent {
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
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
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
                    this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { PlayerDataAccessService } from '../../../services/data-access/player-data-access.service';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import parsers from '../../../utils/parsers';

interface IFormControls {
    name: FormControl<string>;
    activeSince: FormControl<string>;
    number: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    name: string[];
    activeSince: string[];
    number: string[];
}>;

@Component({
    selector: 'app-create-player-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        MixinButtonComponent,
        CommonModule,
    ],
    templateUrl: './create-player-page.component.html',
})
export class CreatePlayerPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private playerDataAccess: PlayerDataAccessService,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            activeSince: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            number: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();
        
        this.playerDataAccess
            .createPlayer({
                activeSince: new Date(rawValue.activeSince),
                name: rawValue.name,
                number: parseInt(rawValue.number),
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
                    this.router.navigate(['/players']);
                },
            });
    }
}

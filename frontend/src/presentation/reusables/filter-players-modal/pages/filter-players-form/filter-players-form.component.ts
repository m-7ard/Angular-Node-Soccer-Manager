import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerDataAccessService } from '../../../../services/data-access/player-data-access.service';
import { MixinButtonComponent } from '../../../../ui-mixins/mixin-button/mixin-button.component';
import { FormFieldComponent } from '../../../form-field/form-field.component';
import { CharFieldComponent } from '../../../char-field/char-field.component';
import IPresentationError from '../../../../errors/IPresentationError';
import { CommonModule } from '@angular/common';
import RawFormValues from '../../../../utils/types';

interface IFormControls {
    name: FormControl<string>;
}

export type IFilterPlayersFormRawValue = RawFormValues<IFormControls>;

type IErrorSchema = IPresentationError<{
    name: string[];
}>;

@Component({
    selector: 'app-filter-players-form',
    standalone: true,
    imports: [
    FormFieldComponent,
    CharFieldComponent,
    CommonModule,
    ReactiveFormsModule,
    MixinButtonComponent
],
    templateUrl: './filter-players-form.component.html',
})
export class FilterPlayersFormComponent {
    form!: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    @Output() onSubmit = new EventEmitter<{
        name: string;
    }>();

    constructor() {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }
}

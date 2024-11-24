import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    GeneratedFileName,
    ImageUploadFieldComponent,
    ImageUploadValue,
    RequiredImageData,
} from '../../../reusables/image-upload-field/image-upload-field.component';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinButtonComponent } from '../../../ui-mixins/mixin-button/mixin-button.component';
import { Router } from '@angular/router';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import { CommonModule } from '@angular/common';
import { PopoverTriggerDirective } from '../../../reusables/popover/popover-trigger.directive';
import { TestPopver } from './test.component';
import IPresentationError from '../../../errors/IPresentationError';
import { catchError, of } from 'rxjs';
import IApiError from '../../../errors/IApiError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { HttpErrorResponse } from '@angular/common/http';

interface IFormValue {
    name: string;
    dateFounded: string;
    number: string;
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
        ImageUploadFieldComponent,
        MixinButtonComponent,
        CommonModule,
        PopoverTriggerDirective,
    ],
    templateUrl: './create-team-page.component.html',
})
export class CreateTeamPageComponent implements OnInit {
    form!: FormGroup;
    protected TestPopver = TestPopver;
    errors: IErrorSchema = {};

    constructor(
        private fb: FormBuilder,
        private _router: Router,
        private _teamDataAccess: TeamDataAccessService,
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            name: new FormControl('', [Validators.required]),
            dateFounded: new FormControl('', [Validators.required]),
            number: new FormControl('', [Validators.required])
        });
    }

    async uploadImages(files: File[]) {
        const uploadedImages: RequiredImageData[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const generatedFileName = `${crypto.randomUUID()}.jpg`;

            uploadedImages.push({
                generatedFileName: generatedFileName as GeneratedFileName,
                originalFileName: file.name,
                url: '/assets/' + generatedFileName,
            });
        }

        return uploadedImages;
    }

    onSubmit(): void {
        const value = this.form.value;

        const requestObserver = this._teamDataAccess.createTeam({
            dateFounded: value.dateFounded,
            name: value.name,
        });

        requestObserver
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    return of(null);
                }),
            )
            .subscribe({
                next: (body) => {
                    if (body == null) {
                        return;
                    }

                    this._router.navigate(['/teams']);
                },
            });
    }
}
